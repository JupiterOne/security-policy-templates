/**
 * This utility parses the FedRAMP controls into a JSON document
 * - Download the FedRAMP controls from:
 *   https://www.fedramp.gov/assets/resources/documents/FedRAMP_Security_Controls_Baseline.xlsx
 * - Save each Worksheet within the Excel file to CSV 
 * - Update the const values as needed and run this utility
 */
const csvtojson = require("csvtojson");
const fs = require('fs');
const capitalize = require('lodash/capitalize');

/**
 * Edit the CSV headers to be:
 * Count,"SORT ID",Family,ID,Control Name,"NIST Control Description",Parameters,Guidance,"FedRAMP Parameter",,,
 */
const level = 'Low';
const inputFile = `.work/FedRAMP_Security_Controls_Baseline_${level}.csv`;
const outputFile = `../templates/standards/fedramp-${level.toLowerCase()}.json`;
const tempFile = '.work/fedramp-raw.json';

async function parse() {
  const framework = {
    standard: 'FedRAMP',
    version: `(${level}) NIST 800-53r4`,
    webLink: 'https://www.fedramp.gov/assets/resources/documents/FedRAMP_Security_Controls_Baseline.xlsx',
    domains: []
  };

  const fedramp = await csvtojson().fromFile(inputFile);

  fs.writeFileSync(tempFile, JSON.stringify(fedramp, null, 2));

  const domains = [];
  const controlsByDomain = {}

  for (const control of fedramp || []) {
    if (control.Family && control.Family.length > 0) {
      const domain = control.Family;
      const controls = controlsByDomain[domain] || [];
  
      if (!domains.includes(domain)) {
        domains.push(domain);
        controlsByDomain[domain] = controls;
      }
      controls.push(
        parseControl(control)
      );
    }
  }

  for (const domain of domains) {
    framework.domains.push({
      title: domain,
      controls: controlsByDomain[domain],
    });
  }

  fs.writeFileSync(outputFile, JSON.stringify(framework, null, 2));
}

function parseControl(data) {
  const description = data["NIST Control Description"];
  const parameters = data.Parameters;

  const regex = 
    /((?:.|\n|\r)+?)(?:(?=Supplemental Guidance: )Supplemental Guidance: ((?:.|\n|\r)+?))?(?:(?=Related Controls?: )Related Controls?: ((?:.|\n|\r)+?))?(?:(?=Control Enhancements?: )Control Enhancements?: ((?:.|\n|\r)+?))?(?:(?=References?: )References?: ((?:.|\n|\r)+?))?$/gi;
  const match = regex.exec(description);

  let [
    ,
    summary,
    guidance,
    relatedControls,
    enhancements,
    references
  ] = match;

  if (data["FedRAMP Parameter"] === 'x') {
    summary = parseParams(summary, parameters);
  }

  const control = {
    ref: data.ID,
    title: 
      data["Control Name"].toLowerCase()
        .replace(/\w+/g, capitalize)
        .replace(/\n/g, ' ')
        .replace(/\sAnd\s/g, ' and ')
        .replace(/\sFor\s/g, ' for ')
        .replace(/\sThe\s/g, ' the ')
        .replace(/\sIn\s/g, ' in ')
        .replace(/\sOf\s/g, ' of ')
        .replace(/\sOn\s/g, ' on ')
        .replace(/\sOr\s/g, ' or '),
    summary: summary.trim(),
    // guidance,
    // relatedControls,
    // enhancements,
    // references
  }
  return control;
}

function parseParams(summaryString, paramString) {  
  if (paramString && paramString.length > 0) {
    const parameters = paramString.split('\n');
    const mappedParameters = {};

    /**
     * Parses the parameters string into:
     * `{ [itemNumber]: [value] }`
     **/ 
    for (const parameter of parameters || []) {
      if (parameter.trim().length > 1) {
        const regex = /(.+)\[(.+)\]/;

        if (regex.exec(parameter)) {
          const [ , reference, value ] = regex.exec(parameter);
          const parseReferenceIds = reference.match(/^(.+)(?=\([a-z]\))(\([a-z]\).*)?/);
          const control = parseReferenceIds ? parseReferenceIds[1].trim() : reference.trim();
          let item = 'self';
          if (parseReferenceIds && parseReferenceIds[2].length > 0) {
            if (parseReferenceIds[2].indexOf('-') > 0) {
              item = parseReferenceIds[2].substring(0, parseReferenceIds[2].indexOf('-'));      
            } else {
              item = parseReferenceIds[2];
            }
            item = item
              .replace(/\) ?\(/, '.')
              .replace(/\)|\(/g, '')
              .trim();
          }

          if (mappedParameters[item]) {
            mappedParameters[item].push(value);
          } else {
            mappedParameters[item] = [value];
          }
        }
        else {
          console.log(`no parameter match for: ${paramString}`);
        }
      }
    }

    const lines = [];
    let previousItem = 'self';

    /**
     * Parses each line of the control summary to find `[Assignment: ....]`
     * and replaces each with the parameter value based on item number
     **/ 
    for (let line of summaryString.split("\n")) {
      if (line.trim().length > 0) {
        const itemNumberMatch = line.trim().match(/^([a-z0-9])\./);
      
        let itemNumber = itemNumberMatch ? itemNumberMatch[1] : 'self';
        itemNumber = (parseInt(itemNumber) && previousItem !== 'self')
          ? `${previousItem}.${itemNumber}`: itemNumber;
  
        const assignmentRegex = /(\[Assignment: [^\]]+\])/g;
        let index = 0;
        for (const match of line.match(assignmentRegex) || []) {
          if (mappedParameters[itemNumber]) {
            const parameterValue = mappedParameters[itemNumber][index];
            if (parameterValue && parameterValue != 'SKIP') {
              if (parameterValue.match(/^(selection )?to include/)) {
                line = line.replace(
                  match, 
                  `${match.replace(']', '')}, **${parameterValue}**]`);
              } else {
                line = line.replace(match, `**${parameterValue}**`);
              }
            }
          }
          index++;
        }
        previousItem = itemNumber.split(".")[0];
      }

      lines.push(line);
    }

    return lines.join('\n');
  }
  
  return summaryString;
}

parse();
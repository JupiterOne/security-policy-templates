/**
 * This utility parses the THSA questionnaire into a JSON document
 * 
 * THSA - Together Health Security Assessment
 * see: https://www.together.health/security-assessment
 */
const csvtojson = require("csvtojson");
const fs = require('fs');

/**
 * Expected CSV Headers:
 * Ref,Criteria,Controls,Selected Controls
 */
const version = '2019.1';
const inputFile = `.work/TogetherHealth+Security+Assessment+-+THSA+v2019.1.csv`;
const outputFile = `../templates/standards/thsa.json`;
const tempFile = '.work/thsa-controls.json';

const headerRefId = 'SCF #';
const headerDomain = 'SCF Domain';
const headerControl = 'SCF Control';
const headerDescription = 'SCF Control Question';

async function parse() {
  const framework = {
    standard: 'THSA',
    version,
    webLink: 'https://www.together.health/security-assessment',
    domains: []
  };

  const data = await csvtojson().fromFile(inputFile);

  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));

  const domains = [];
  const controlsByDomain = {}

  let domain;
  let controls;
  for (const control of data || []) {
    if (control) {
      domain = control[headerDomain];
      controls = controlsByDomain[domain] || [];
  
      if (!domains.includes(domain)) {
        domains.push(domain);
        controlsByDomain[domain] = controls;
      }
    
      if (control[headerRefId].length > 0) {
        controls.push({
          ref: control[headerRefId],
          title: control[headerControl],
          summary: control[headerDescription]
        });
      }
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

parse();
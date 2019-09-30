/**
 * This utility parses the SOC 2 controls into a JSON document
 */
const csvtojson = require("csvtojson");
const fs = require('fs');
const startCase = require('lodash/startcase');

/**
 * Expected CSV Headers:
 * Ref,Criteria,Controls,Selected Controls
 */
const scope = 'Security';
const inputFile = `.work/soc2-controls.csv`;
const outputFile = `../templates/standards/soc2-${scope.toLowerCase()}.json`;
const tempFile = '.work/soc2-controls.json';

async function parse() {
  const framework = {
    standard: 'SOC 2',
    version: `TSC ${scope}`,
    webLink: 'https://www.aicpa.org/content/dam/aicpa/interestareas/frc/assuranceadvisoryservices/downloadabledocuments/trust-services-criteria.pdf',
    domains: []
  };

  const data = await csvtojson().fromFile(inputFile);

  fs.writeFileSync(tempFile, JSON.stringify(data, null, 2));

  const domains = [];
  const controlsByDomain = {}

  let domain;
  let controls;
  for (const control of data || []) {
    if (control.Ref.length == 0 && control.Criteria.length > 0) {
      domain = startCase(control.Criteria.toLowerCase());
      controls = controlsByDomain[domain] || [];
  
      if (!domains.includes(domain)) {
        domains.push(domain);
        controlsByDomain[domain] = controls;
      }
    }
    else if (control.Ref.length > 0) {
      controls.push(
        ...parseControl(control)
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
  const title = data.Criteria.split(':')[0];
  const summary = data.Criteria.split(':')[1];

  const criteria = {
    ref: data.Ref,
    title: summary ? title.trim() : data.Ref,
    summary: summary ? summary.trim() : title.trim(),
  }

  const controls = [];
  let controlNum = 0;
  for (const control of data.Controls.split('•') || []) {
    if (controlNum == 0) {
      controlNum++;
      continue;
    }
    const controlSummary = control.trim();
    if (controlSummary.length > 0) {
      controls.push({
        ref: `${data.Ref} (${String.fromCharCode(96 + controlNum)})`,
        summary: controlSummary
      });
      controlNum++;
    }
  }

  return [
    criteria,
    ...controls
  ];
}

parse();
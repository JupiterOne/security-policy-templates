'use strict';

const fs = require('fs');

const inputFile = '../templates/config.json';
const outputFile = '../templates/standards/security-program.json';
const mappingFile = '../templates/standards/controls-mapping.json';

const input = JSON.parse(fs.readFileSync(inputFile)); 
const mapping = JSON.parse(fs.readFileSync(mappingFile));

const domains = [];
const proceduresById = {};

for (const procedure of input.procedures || []) {
  proceduresById[procedure.id] = {
    ref: procedure.id,
    title: procedure.name,
    summary: procedure.summary
  }
}

for (const policy of input.policies || []) {
  const controls = [];
  for (const control of policy.procedures || []) {
    if (proceduresById[control]) {
      controls.push(proceduresById[control]);
    }
  }
  domains.push({
    title: policy.name,
    controls
  })
}

const standard = {
  standard: "Security Program",
  version: `${new Date().getFullYear()}`,
  webLink: "https://apps.us.jupiterone.io/policies",
  domains
}

fs.writeFileSync(outputFile, JSON.stringify(standard, null, 2));

/**
 * Process SOC 2 mappings
 */
const soc2inputFile = '../templates/standards/soc2-controls-mapping.json';
const soc2outputFile = '../templates/standards/soc2-security-controls.json';

const soc2 = JSON.parse(fs.readFileSync(soc2inputFile)); 

const soc2domains = [];
for (const domain of soc2.domains || []) {
  for (const control of domain.controls || []) {
    const controls = [];
    for (const procedureId of control.procedures || []) {
      const procedure = proceduresById[procedureId];
      if (procedure) {
        controls.push({
          ref: procedureId,
          title: procedure.title,
          summary: procedure.summary
        });
      }
    }
    soc2domains.push({
      title: `§ ${domain.title}\n【${control.ref}】 ${control.summary}`,
      controls
    })
  }
}

const soc2output = {
  standard: soc2.standard,
  version: soc2.version,
  webLink: soc2.webLink,
  domains: soc2domains
}

fs.writeFileSync(soc2outputFile, JSON.stringify(soc2output, null, 2));

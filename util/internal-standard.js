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

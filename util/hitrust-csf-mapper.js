'use strict';

const fs = require('fs');

const hitrustFile = '.work/hitrust-csf-v9.2-all.json';
const mappingFile = '../templates/standards/controls-mapping.json';

const hitrust = JSON.parse(fs.readFileSync(hitrustFile)); 

const mapping = JSON.parse(fs.readFileSync(mappingFile));

const requirementsByControl = {};

for (const domain of hitrust.domains || []) {
  for (const control of domain.controls || []) {
    requirementsByControl[control.ref] = [];
  }
}

for (const section of hitrust.sections || []) {
  for (const requirement of section.requirements || []) {
    if (requirementsByControl[requirement.control]) {
      requirementsByControl[requirement.control].push(requirement.ref);
    }
  }
}

for (const procedure of mapping.procedures || []) {
  for (const implement of procedure.implements || []) {
    if (implement.standard === 'HITRUST CSF') {
      implement.requirements = [];
      for (const control of implement.controls || []) {
        implement.requirements.push(...requirementsByControl[control]);
      }
    }
  }
}

fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));

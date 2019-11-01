'use strict';

const fs = require('fs');

const ctrlreqFile = '.work/controls-reqs.json';
const mappingFile = '../templates/standards/controls-mapping.json';
const standardName = 'MyStandard'

const ctrlreq = JSON.parse(fs.readFileSync(ctrlreqFile)); 

const mapping = JSON.parse(fs.readFileSync(mappingFile));

const requirementsByControl = {};

for (const domain of ctrlreq.domains || []) {
  for (const control of domain.controls || []) {
    requirementsByControl[control.ref] = [];
  }
}

for (const section of ctrlreq.sections || []) {
  for (const requirement of section.requirements || []) {
    if (requirementsByControl[requirement.control]) {
      requirementsByControl[requirement.control].push(requirement.ref);
    }
  }
}

for (const procedure of mapping.procedures || []) {
  for (const implement of procedure.implements || []) {
    if (implement.standard === standardName) {
      implement.requirements = [];
      for (const control of implement.controls || []) {
        implement.requirements.push(...requirementsByControl[control]);
      }
    }
  }
}

fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));

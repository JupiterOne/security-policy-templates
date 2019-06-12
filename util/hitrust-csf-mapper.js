'use strict';

const fs = require('fs');

const hitrustFile = '../templates/standards/hitrust-csf.json';
const mappingFile = '../templates/standards/controls-mapping.json';

const hitrust = JSON.parse(fs.readFileSync(hitrustFile)); 

const mapping = JSON.parse(fs.readFileSync(mappingFile));

const controlsByReq = {};

for (const section of hitrust.sections || []) {
  for (const requirement of section.requirements || []) {
    controlsByReq[requirement.ref] = [];
  }
}

for (const domain of hitrust.domains || []) {
  for (const control of domain.controls || []) {
    if (controlsByReq[control.requirement]) {
      controlsByReq[control.requirement].push(control.ref);
    }
  }
}

for (const procedure of mapping.procedures || []) {
  for (const implement of procedure.implements || []) {
    if (implement.standard === 'HITRUST CSF') {
      implement.controls = [];
      for (const requirement of implement.requirements || []) {
        implement.controls.push(...controlsByReq[requirement]);
      }
    }
  }
}

fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));

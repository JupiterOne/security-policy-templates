'use strict';

const fs = require('fs');

const rawConfig = fs.readFileSync('../templates/config.json');
const config = JSON.parse(rawConfig);

const proceduresMap = [];
for (const procedure of config.procedures) {
  proceduresMap[procedure.id] = procedure;
}

const referencesMap = [];
for (const reference of config.references) {
  referencesMap[reference.id] = reference;
}

const policyOutputs = [];
for (const policy of config.policies) {
  const procedureOutputs = [];
  for (const p of policy.procedures) {
    if (proceduresMap[p]) {
      procedureOutputs.push(
        `- **${proceduresMap[p].name}**\n\n` +
        `  _${proceduresMap[p].summary}_\n\n`
      );
    } else if (referencesMap[p]) {
      procedureOutputs.push(
        `- **${referencesMap[p].name}**\n\n`
      );
    }
  }
  policyOutputs.push(
    `## ${policy.name}\n\n` +
    procedureOutputs.join('')
  );
}

const output = '# Summary and Guidance\n\n' + policyOutputs.join('');

fs.writeFileSync('../summary.md', output);

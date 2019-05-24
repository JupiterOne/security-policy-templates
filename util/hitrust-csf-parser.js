/* This utility parses the json export from HITRUST MyCSF into the format that
 * can be uploaded to JupiterOne.
 * 
 * To use:
 * 
 * - log in to your MyCSF account
 *   <https://portal.mycsf.net>
 * 
 * - open the assessment object you have created
 *   (e.g. https://app.mycsf.net/apps/MyCSF/index.html#!/Assessments/4980/4225)
 * 
 * - capture json output from network response
 *   (the name should correspond to your assessment object followed by `/` - e.g. 4225/)
 * 
 * - copy and save the data into a working directory as json
 *   (e.g. .work/mycsf-export.json)
 * 
 * - run this script:
 *   `node hitrust-csf-parser.js`
 * 
 * - copy the content from the output file and replace the `domains` section of
 *   the `standards/hitrust-csf.json` document, and upload it to your JupiterOne
 *   account in the compliance app.
 */

'use strict';

const fs = require('fs');

// Read the json file exported from HITRUST MyCSF
const hitrust = JSON.parse(
  fs.readFileSync('.work/mycsf-export.json')
); 

// Regex to match CSF requirement from control id
const regex = /(\d+\.)(\d{2})(\.)?([a-z]{1,2})(.+)/;

let count = 0;
const domains = [];
for (const domain of hitrust.CSFAssessmentDomain) {
  const controls = [];
  for (const req of domain.CSFAssessmentRequirement) {
    const match = regex.exec(req.BaselineUniqueId);
    const controlId = match ? match[1]+match[2]+match[4]+match[5] : req.BaselineUniqueId;
    const requirement = match ? `${match[2]}.${match[4]}` : 'unknown-requirement';
    controls.push({
      ref: controlId,
      summary: req.RequirementStatement,
      requirement,
      applicable: true
    });
    count++;
  }
  domains.push(
    {
      title: domain.Name,
      description: domain.Description,
      controls
    }
  );
}
console.log(`Parsed ${count} in-scope controls.`)

// Writes output file.
// Copy the content of this file to replace the default `domains` section
// in `standards/hitrust-csf.json` and upload the new json to the compliance
// app in your JupiterOne account.
fs.writeFileSync('.work/hitrust-csf-controls.json', JSON.stringify(domains, null, 2));

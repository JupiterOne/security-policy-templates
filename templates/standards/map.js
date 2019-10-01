//I wrote this really quickly...I know the namings and time complexities suck
//I'll fix it later if you guys are interested in using it

const fs = require('fs');
const lodash = require('lodash');

async function createMappingFields() {
    var controls = fs.readFileSync("soc2-security.json");
    controls = JSON.parse(controls);
    controls = controls['domains'];

    for (domain of controls) {
        for (control of domain['controls']) {
          control['Procedures'] = [];
          control['Status'] = 'Not started';
        }
    }

    let data = JSON.stringify(controls, null, 2);
    fs.writeFileSync('soc2-mappings.json', data);
}


async function mapProcedures() {
    var sections = fs.readFileSync("soc2-mappings.json");
    var mappings = fs.readFileSync("controls-mapping.json");
    sections = JSON.parse(sections);
    mappings = JSON.parse(mappings);

    for (section of sections) {
        for (control of section['controls']) {
            for (procedure of control['Procedures']) {
                var picked = lodash.filter(mappings['procedures'], { 'id': procedure } )[0];
                var soc2 = lodash.filter(picked['implements'], { 'standard': 'SOC2' } )[0];
                if (soc2['controls'].indexOf(control['ref']) === -1) {
                    soc2['controls'].push(control['ref']);
                }
            }
        }
    }

    let data = JSON.stringify(mappings, null, 2);
    fs.writeFileSync('controls-mapping.json', data);

}

mapProcedures();
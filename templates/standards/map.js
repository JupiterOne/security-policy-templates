const fs = require('fs');

async function map() {
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

map();
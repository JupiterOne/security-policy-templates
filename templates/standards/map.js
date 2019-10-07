const fs = require('fs');
const lodash = require('lodash');


async function addStandardToControlsMappings(standardName, controlsMappingFile) {
    let controlsMappings = JSON.parse(fs.readFileSync(controlsMappingFile));

    for (procedure of controlsMappings['procedures']) {
        procedure['implements'].push({"standard": `${standardName}`, "requirements": [], "controls": []});
    }

    let data = JSON.stringify(controlsMappings, null, 2);
    fs.writeFileSync(controlsMappingFile, data);
}

async function createMappingFields(standardsDoc, outputFile) {
    let standards = JSON.parse(fs.readFileSync(standardsDoc));

    for (domain of standards['domains']) {
        for (control of domain['controls']) {
          control['Procedures'] = [];
          control['Status'] = 'Not started';
        }
    }

    let data = JSON.stringify(standards, null, 2);
    fs.writeFileSync(outputFile, data);
}


async function mapProcedures(standardsMappingsFile, outputControlsMappingFile) {
    let standardsMappings = JSON.parse(fs.readFileSync(standardsMappingsFile));
    let controlsMappings = JSON.parse(fs.readFileSync(outputControlsMappingFile));

    for (section of standardsMappings['domains']) {
        for (control of section['controls']) {
            for (procedure of control['Procedures']) {
                let procedureToMap = lodash.filter(controlsMappings['procedures'], { 'id': procedure } )[0];
                var soc2 = lodash.filter(procedureToMap['implements'], { 'standard': 'SOC2' } )[0];
                if (soc2['controls'].indexOf(control['ref']) === -1) {
                    soc2['controls'].push(control['ref']);
                }
            }
        }
    }

    let data = JSON.stringify(controlsMappings, null, 2);
    fs.writeFileSync(outputControlsMappingFile, data);

}


async function getUncompletedControls(standardsMappingsFile) {
    let standardsMappings = JSON.parse(fs.readFileSync(standardsMappingsFile));
    let count = 0;

    for (section of standardsMappings['domains']) {
        for (control of section['controls']) {
            if (control['Status'] !== "COMPLETE") {
                count += 1;
                console.log(`Control "${control['ref']}: ${control['summary']}" has status "${control['Status']}"\n`);
            }
        }
    }

    console.log("Total uncompleted controls: " + count);
}

//addStandardToControlsMappings("SOC2", "controls-mapping.json");
//createMappingFields("soc2.json", "soc2-mappings.json");
mapProcedures("soc2-mappings.json", "controls-mapping.json");
//getUncompletedControls("soc2-mappings.json");

/*

Procedures we should add/modify:
- BoD charter
- company organizational chart w/ role descriptions and responsibilities
- employee expectations (employee evaluations, incentives, performance measures, training, etc)
- new-hire process
- communications- internal and external (including info on contracts, NDA, SLA)
- change (external environment, business, leadership)- how we communicate, process, etc
- risk (external factors, fraud)
- physical access logging
- data transmission
- vendor expectations
*/
#!/usr/bin/env python

import argparse, json, re, requests, sys

# based on OSCAL v1.0.4

def createArgumentParser():
    parser = argparse.ArgumentParser(
        prog = 'OSCAL Parser and Converter',
        description = 'Given an input URL that points to a JSON version of an OSCAL baseline/standard file and an output path/filename, parse the OSCAL into a format that the JupiterOne compliance app can read and use.',
        usage = 'Both a URL and a destination file name/path are required as this script needs an input (the URL) and an output (the destination filepath)'
    )
    parser.add_argument('-u', '--url', required=True, help="The URL of where the JSON version of the OSCAL file baseline/standard that you want parsed exists.  e.g.: https://raw.githubusercontent.com/GSA/fedramp-automation/master/dist/content/rev5/baselines/json/FedRAMP_rev5_MODERATE-baseline-resolved-profile_catalog.json")
    parser.add_argument('-o', '--output', required=True, help="The path and filename of the output for this parser, such as templates/standards/fedramp/v5/fedramp-moderate.json")
    return parser


def getOSCAL(url: str):    
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()

def parseGroups(groupsList: list) -> dict:
    #print('parseGroups')
    domainsDict = {}
    for group in groupsList:
        key = group['id']
        #print('Group key: {}'.format(key))
        domainsDict[key] = {'text': group['title']}
        #print("domainsDict[{}]['text']: {}".format(key, group['title']))
        if 'controls' in group:
            domainsDict[key].update(parseControls(group['controls']))
    return domainsDict

def parseProps(propsList: list) -> str:
    for prop in propsList:
        if prop['name'] == 'label':
            return prop['value']
    
def parseControls(controlsList: list) -> dict:
    #print('parseControls')
    controlsDict = {}
    for control in controlsList:
        key = parseProps(control['props'])
        #print('Control key: {}'.format(key))
        controlsDict[key] = {'text': control['title']}
        #print("controlsDict[{}]['text']: {}".format(key, control['title']))
        paramsDict = {}
        if 'params' in control:
            unresolvedParamsDict = parseParams(control['params'])
            paramsDict = resolveVars(unresolvedParamsDict, unresolvedParamsDict)
        if 'parts' in control:
            controlsDict[key].update(resolveVars(paramsDict, parseParts(control['parts'])))
        if 'controls' in control:
            controlsDict[key]['controls'] = parseControls(control['controls'])
    return controlsDict
            
def parseParts(partsList: list) -> dict:
    #print('parseParts')
    partsDict = {}
    for part in partsList:
        key = None
        if part['name'] == 'statement':
            #print('part is a statement')
            if 'props' in part:
                #print('found props in part')
                key = parseProps(part['props'])
                #print('part key: {}'.format(key))
            else:
                #print('no props in part')
                key = part['name']
                #print('part key: {}'.format(key))
            partsDict[key] = {}
            # recurse as necessary
            if 'parts' in part:
                #print('found parts in part')
                if 'prose' in part:
                    #print('found prose in part that has parts')
                    partsDict[key]['text'] = part['prose']
                    #print("partsDict[{}]['text']: {}".format(key, part['prose']))
                else:
                    #print('no prose in part that has parts')
                    key = part['name']
                    #print('part key: {}'.format(key))
                    partsDict[key] = {}
                #print('recurse to resolve parts in part')
                partsDict[key].update(parseParts(part['parts']))
            else:
                #print('no parts in part')
                key = part['name']
                #print('part key: {}'.format(key))
                partsDict[key] = part['prose']
        elif part['name'] == 'item':
            #print('part is an item')
            key = ''
            if 'props' in part:
                key = parseProps(part['props'])
            else:
                key = part['title']
            #print('part key: {}'.format(key))
            partsDict[key] = {}
            if 'parts' in part:
                #print('found parts in part')
                if 'prose' in part:
                    partsDict[key]['text'] = part['prose']
                    #print("partsDict[{}]['text']: {}".format(key, part['prose']))
                #print('recurse to resolve parts in part')
                partsDict[key].update(parseParts(part['parts']))
            else:
                #print('part is a simple item')
                #print('partsDict[{}]: {}'.format(key, part['prose']))
                partsDict[key] = part['prose']
        elif part['name'] == 'guidance':
            #print('part is guidance')
            key = part['name']
            #print('part key: {}'.format(key))
            partsDict[key] = part['prose']
    return partsDict
    
def resolveVars(valuesDict: dict, varsDict: dict) -> dict:
    OSCAL_var_pattern = re.compile(r'(?P<entire_var>{{\s*insert:\s*param,\s*(?P<var_name>.*?)\s*}})')
    for key, value in varsDict.items():
        if isinstance(value, dict):
            #print('value is a dict, recursing...')
            varsDict[key] = resolveVars(valuesDict, value)
        else:
            #print('Checking "{}"'.format(value))
            matcherator = OSCAL_var_pattern.finditer(value)
            for match in matcherator:
                #print('Replacing "{}" in "{}" with "{}"'.format(match['entire_var'], varsDict[key], valuesDict[match['var_name']]))
                varsDict[key] = re.sub(match['entire_var'], valuesDict[match['var_name']], varsDict[key])
                #print('varsDict[{}]: {}'.format(key, varsDict[key]))
    return varsDict

def parseParams(paramList : list) -> dict:
    paramDict = {}
    for param in paramList:
        key = param['id']
        if 'constraints' in param:
            paramDict[key] = ', '.join([constraint['description'] for constraint in param['constraints']])
            if 'select' in param:
                paramDict[key] = re.sub(r'Selection:\s*', '', paramDict[key])
        elif 'select' in param:
            if 'how-many' in param['select']:
                paramDict[key] = "{{{{ {}: {} }}}}".format(param['select']['how-many'].replace('-', ' '), ', '.join(param['select']['choice']))
            else:
                paramDict[key] = '{{{{ {} }}}}'.format(' OR '.join(param['select']['choice']))
        elif 'guidelines' in param:
            guidelineText = ', '.join(guideline['prose'] for guideline in param['guidelines'])
            paramDict[key] = "{{{{ {} - {} }}}}".format(param['label'], guidelineText)
        elif 'label' in param:
            paramDict[key] = '{{{{ {} }}}}'.format(param['label'])
    return paramDict

def dictSubValue(oldDict: dict, pattern, newValue: str) -> dict:
    newDict = {}
    for key, value in oldDict.items():
        if isinstance(value, dict):
            value = dictSubValue(value, pattern, newValue)
        elif isinstance(value, list):
            value = listSubValue(value, pattern, newValue)
        elif isinstance(value, str):
            value = pattern.sub(newValue, value)
        newDict[key] = value
    return newDict

def listSubValue(oldList: dict, pattern, newValue: str) -> list:
    newList = []
    for element in oldList:
        if isinstance(element, list):
            element = listSubValue(element, oldValue, newValue)
        elif isinstance(element, dict):
            element = dictSubValue(element, oldValue, newValue)
        elif isinstance(element, str):
            element = pattern.sub(newValue, element)
        newList.append(element)
    return newList

def removeBookmarks(domainsDict: dict) -> dict:
    BOOKMARK_pattern = re.compile(r'\(#.+?\)')
    return dictSubValue(domainsDict, BOOKMARK_pattern, '')

def buildSummary(someDict: dict, indent: int = 0) -> str:
    summaryStr = ''
    for key, value in someDict.items():
        #print('key: {}'.format(key))
        if isinstance(value, dict):
            #print('value is a dict, recurse')
            summaryStr += '\n{} {}'.format(key, buildSummary(value, indent)) if key != 'text' and key != 'statement' else '\n{}'.format(buildSummary(value, indent))
        elif key != 'guidance':
            #print('value: {}'.format(value))
            summaryStr += '\n{} {}'.format(key, value) if key != 'text' and key != 'statement' else '\n{}'.format(value)
    # remove leading line feed before returning constructed string
    return re.sub(r'^\n', '', summaryStr, count=1)

def createSecurityPolicyTemplate(domainsDict: dict) -> list:
    domainsList = []
    for domain, domainDict in domainsDict.items():
        listDict = {
            'title': domainDict['text'],
            'controls': []
        }
        controlsList = []
        for controlKey, controlDict in domainDict.items():
            # key is either text (str), statement (dict), guidance (str), or controls (dict)
            if controlKey != 'text':
                dictToAppend = {
                    'ref': controlKey,
                    'title': controlDict['text'],
                    'summary': buildSummary(controlDict),
                    'guidance': controlDict['guidance'] if 'guidance' in controlDict else ''
                }
                controlsList.append(dictToAppend)
        listDict['controls'] = controlsList
        domainsList.append(listDict)
    return domainsList

p = createArgumentParser()
args = p.parse_args()
OSCAL_JSON = getOSCAL(args.url)
catalog = OSCAL_JSON['catalog']
domainsDict = {}
domainsDict = parseGroups(catalog['groups'])
domainsDict = removeBookmarks(domainsDict)
#print(json.dump(domainsDict, sys.stdout, ensure_ascii=True, indent=4, sort_keys=False))

securityPolicyDict = {
    'standard': catalog['metadata']['title'], 
    'version': re.search(r'(?P<version>Rev\s*\w+)', catalog['metadata']['title'])['version'],
    'basedOn': catalog['metadata']['version'], 
    'webLink': args.url,
    'domains': createSecurityPolicyTemplate(domainsDict)
}

with open(args.output, 'w') as out_file:
    json.dump(securityPolicyDict, out_file, ensure_ascii=True, indent=4, sort_keys=False)
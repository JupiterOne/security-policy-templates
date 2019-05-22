# This util searches a standards document against our procedure docs and returns likely
# matches for each standard
# Run with Python3!!


from json import load
from os import path, rename, mkdir, listdir
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk import download
from whoosh.index import create_in, open_dir
from whoosh.fields import Schema, TEXT
from whoosh.qparser import QueryParser
from whoosh import scoring

directory = '/Users/jpdimarz/Repos/security-policy-templates/templates/procedures' #set this to the appropriate path
standards_file = 'csa-ccm.json' #set this to the appropriate file
#download('punkt')  these must be downloaded the first time the script is ran
#download('stopwords')
stopwords = set(stopwords.words('english'))
stop_words = stopwords.union(['.', ',', '(', ')', 'shall', 'e.g.', 'use', 'i.e.', '/', ':', '•', "'s", 'and/or'])

def searchStandards():
    procedures = listdir('procedures')
    searchDict = dict()
    
    for procedure in procedures:  #change extension to .txt if necessary
        if (procedure[-8:] == ".md.tmpl"):
            oldPath = path.join(directory, procedure)
            target = path.join(directory, (procedure[:-8] + '.txt'))
            rename(oldPath, target)

    with open(standards_file) as f:  #load the file with the standards
        ccm = load(f)
        sections = ccm['sections']

    for section in sections:
        for standard in section['requirements']:
            word_tokens = word_tokenize((standard['title'] + " " + standard['summary']).lower())

            filtered_sentence = []
            for w in word_tokens: 
                if w not in stop_words: 
                    filtered_sentence.append(w)

            newSum = ""
            for w in filtered_sentence:  #create the search query from condensed terms
                newSum = newSum + " OR " + w

            searchDict[('Suggestions for ' + standard['title'] + ': ' + standard['ref'])] = newSum


    schema = Schema(title=TEXT(stored=True), content=TEXT(stored=True)) #schema for indexing file

    if not path.exists("indexdir"):  #create directory for indexing
        mkdir("indexdir")
    ix = create_in("indexdir", schema=schema, indexname="usages")

    writer = ix.writer()
    for procedure_file in procedures:  #index each file
        procedure = path.join(directory, procedure_file)
        with open(procedure, mode="r", encoding="utf-8") as f:
            text = f.read()
            writer.add_document(title=procedure_file, content=text)
    writer.commit()
 
 
    searcher = ix.searcher() 
    with ix.searcher() as searcher: #search the index to get results
        for title, searchQuery in searchDict.items():
            query = QueryParser("content", schema=ix.schema).parse(searchQuery)
            results = searcher.search(query)
            print(title)
            for i in range(5):
                print(results[i]['title'])
            print()



def main():
    searchStandards()

if __name__ == "__main__":
    main()

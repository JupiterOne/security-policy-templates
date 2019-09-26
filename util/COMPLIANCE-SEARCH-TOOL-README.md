### Compliance Standards Searcher Tool Against Procedure Docs

This Python script uses nltk and whoosh libraries to condense standards
from a compliance document in our standardized json form into searchable queries
and then index a directory of procedure/policy documents and run the search queries
against them. The 5 most likely documents to fulfill each standard are outputted.

#### How to Run

Run setup-compliance-script.py to install dependencies.

The searcher script has arguments for the name of the compliance document json as well as 
the full path to the directory of procedure docs.

The script should be ran as follows:
`python3 compliance.py -sf example-compliance.json -dir /Users/person/Repos/security-policy-templates/templates/procedures`


#### Modifying The Script

"Stopwords" are removed from the standards to make them more searchable. To add or remove stopwords,
change the union statement on line 29 of compliance.py.

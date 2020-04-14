### Source Code Management

 development/engineering team uses  for
source code management. Access to  and its configuration
standards include:

* All developers must authenticate to gain access to  and code
  repos hosted on  according to standards and procedures
  defined in the [Access Policy](access.md):

  - Access control to the  web interface must be enabled, via
    SSO and/or MFA if applicable
  
  - SSH public/private key access may be used for command line or `git` access
    to the code repos

* All code repos in  follow these configuration standards:

  - All repos must have an owner identified and listed

  - All repos are by default `private`

* Certain branch restrictions are enabled, including:

  - The `master` branch cannot be rebased

  - Restrict direct commits into `master`

  - Restrict history rewrites of `master`

  - Restrict deletion of `master`

* Certain pull request (PR) requirements are enforced before merging, including:

  - Must have at least 1 review approval to merge

  - Must have at least 1 successful build to merge

  - all PR tasks must be completed
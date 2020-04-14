### Free and Open Source Software (FOSS) Security

 security and development team implemented a process to

  -  Inventory all software dependencies;
  -  Scan software dependencies for known security vulnerability;
  -  Fix any and all high risk findings prior to production; and
  -  Review and identify licensing issues of the 3rd party software and
     libraries.

The current tool in use is Snyk. Snyk supports Node.js, Ruby,
and Java. Documentation can be found at the Snyk website.

Snyk also enables automatic license analysis for dependencies, and this
functionality is embedded into the `securityScan()`  pipeline step.

Snyk can be leveraged in local development environment to scan locally
and/or at every build for dev to include dev dependencies.
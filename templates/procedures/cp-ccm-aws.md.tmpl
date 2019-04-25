### Provisioning AWS Accounts

#### AWS Account Structure / Organization

{{companyShortName}} maintains a single Organization in AWS, maintained in a
top-level AWS account (master). Sub-accounts are connected that each hosts
separate workloads and resources in its own sandboxed environment. The master
account itself handles aggregated billing for all connected sub-accounts but
does not host any workload, service or resource, with the exception of DNS
records for {{companyShortName}} root domain, using AWS Route53 service. DNS
records for subdomains are maintained in the corresponding sub-accounts.

Access to each account is funneled through our designated SSO provider, which
establishes a trust relationship to a set of predefined roles in the master
account. Once authenticated, a user then leverages AWS IAM Assume Role
capability to switch to a sub-account to access services and resources.

The account and network structure looks like the following:

```
SSO/IdP ── {{companyShortName}}-master
            │  └── billing and root DNS records only
            │
            ├── {{companyShortName}}-dev
            │    └── VPC
            │        └── Subnets
            │             └── Security-Groups
            │                  └── EC2 instances
            │                       └── Docker containers
            │            
            ├── {{companyShortName}}-test
            │    └── VPC
            │         └── Subnets
            │              └── Security-Groups
            │                   └── EC2 instances
            │                        └── Docker containers
            │
            ├── {{companyShortName}}-infra
            │    └── VPC
            │         └── Subnets
            │              └── Security-Groups
            │                   └── EC2 instances
            │                        └── Docker containers
            │
            ├── {{companyShortName}}-prod-us1
            │    └── VPC
            │         └── Subnets
            │              └── Security-Groups
            │                   └── EC2 instances
            │                        └── Docker containers
            │
            ├── {{companyShortName}}-prod-us2
            │
            ...
```

#### Infrastructure-as-Code

{{companyShortName}} AWS environments and infrastructure are managed as code.
Provisioning is accomplished using a set of automation scripts and {{provider}}
code.  Each new environment is created as a sub-account connected to
`{{companyShortName}}-master`.  The creation and provisioning of a new account
follows the instructions documented in the Bootstrap a new AWS environment page
of the development wiki.

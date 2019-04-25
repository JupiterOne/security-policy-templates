### Temporary Access to AWS Accounts and Resources

Access to {{companyShortName}} AWS accounts are permissible through temporary credentials /
sessions only.  No persistent users, passwords or access keys are allowed in AWS
IAM configurations for end-user access, either to the AWS console or AWS CLI.
This is achieved with the following processes:

**AWS Console Access**

* An organization master account (`{{companyShortName}}-master`) in AWS is configured with
  IAM roles such as Developer and Security.
* SAML SSO and trust relationship is established between the roles in
  `{{companyShortName}}-master` and an "AWS application" provisioned in Okta.
* Users are assigned their corresponding roles through application and role
  assignment in Okta.
* Via SSO, Users authenticate through Okta by using their Okta username,
  password, and MFA.
* Upon successful authentication and MFA validation, users are logged into
  `{{companyShortName}}-master` using AWS Assume Role capability.
* The roles in `{{companyShortName}}-master` by default has highly restricted access. For
  example, the `Developer` role does not have access to any services and
  resources in the master account.
* The user is required to Assume a Role in a sub-account, connected via
  cross-account trust policy defined at account bootstrap or through an approved
  change management process.  For example, a Developer can assume the
  `Administrator` role in `{{companyShortName}}-dev`, which is the sandboxed development
  environment in a separate AWS account.
* Assume Role access to a production AWS account is highly restricted.

    * Developers can only assume the `Developer` role in production which only
      has access to read CloudWatch logs, XRay system traces/service maps,
      CloudWatch metrics, resource group inventories, and CloudWatch dashboards.
    * Security can only assume the `Auditor` role in production which has the
      default Auditor IAM policy managed by AWS.  This policy allows read-only
      access to account and resource configurations, but does not allow read
      access to any data such as S3 objects.

**AWS CLI/SDK Access**

* [Okta AWS-CLI Tool](https://github.com/oktadeveloper/okta-aws-cli-assume-role)
  is used to obtain temporary credentials (access keys) for developers to
  connect to AWS using the CLI or SDK.
* By running the Okta AWS-CLI Tool, developers are prompted to authenticate to
  Okta using their Okta credentials and MFA token/app.
* Upon successful authentication and MFA validation, a temporary access key and
  session token is inserted into the local configuration file (e.g.
  `~/.aws/credentials` and `~/.aws/config`).
* This temporary credentials expires after one hour and a new temporary
  credential must be obtained for access.
* Through this method, developers are granted the same permission as they would
  by assuming the `Developer` role through AWS console.
* Additional details are documented on the [Development Wiki]({{&devWikiURL}}).

**IAM Safety**

* {{companyShortName}} implements **Dome9** to monitor and protect its AWS environments.
  Dome9 provides an additional layer of defense on top of native IAM policies
  called **IAM Safety**.
* IAM Safety works by defining a set of risky actions, such as adding/remove IAM
  users to an **Explicit Deny** policy.  The policy is attached to an IAM Group,
  and protected Users and/or Roles are assigned to this Group.
* Because explicit deny rules always take precedence in AWS IAM policy, this
  effectively restricts access and prohibits execution of the risky actions as
  defined in the policy, even if the user/role may have administrative
  privilege.
* Original access can be temporarily restored through the Dome9 web console or
  its mobile app.
* Privilege Roles, such as Security role in master account and Administrator
  role in production account, are protected by IAM Safety.
* Additional details can be found on [Dome9's product
  documentation](https://dome9-security.atlassian.net/wiki/spaces/DG/pages/2981893/IAM+Safety+Overview).

**Troubleshooting / Support Access**

In normal operations, troubleshooting is performed with log analysis in Sumo
Logic, outside of the production environments in AWS. A separate Support role is
created for temporary troubleshooting and support access when log access is
insufficient to determine the cause. Support access should be minimized and is
designed to involve manual approval and provision process.

* The Support role by default is NOT assigned to anyone.
* The Support role is configured with Read level access to the services used by
  {{companyShortName}} platform services and applications.  It does NOT have permission to
  make any configuration changes and does NOT have access to production data.
* A PRODCM ticket is used to request temporary support access and must be
  approved by Head of Engineering and Security.
* Upon approval of the support access PRODCM ticket, Security grants the
  requestor temporary access to by assigning the Support role to that particular
  individual user in Okta.
* The Support role is protected by Dome9 with IAM Safety and it must be
  explicitly allowed by the Security team for it to assume the Support role in
  the target production environment.
* By default, temporary Support access is limited to one hour.  This can be
  extended by the Security team.
* The role assignment is removed from Okta immediately after the support session
  and Dome9 IAM Safety is re-enabled.

**Dual Control for Root Access**

{{companyShortName}} implements a Dual Control / Split Knowledge process to protect the Root
user access to our AWS accounts. The process works as follow:

* Security Lead has access to the root account credentials.

    * The credentials are stored encrypted in the master account.
    * Security Lead obtains temporary access to the master account following the
      process listed above (MFA is required).
    * Security Lead must assume a role with permission to access the credential
      (e.g. Administrator), which is protected by an additional layer of IAM
      Safety.

* Engineering Lead has access to the Hardware Tokens associated with the root
  users.

    * The tokens are stored in secured facility with restricted badge reader
      access.
    * The token serial is mapped per account and documented in [{{companyShortName}}
      Engineering Wiki]({{&devWikiURL}}).

When root access is required for business or operational needs, a {{ticketingSystem}} Issue is
created that requires the Security Lead and Engineering Lead to jointly perform
the action.
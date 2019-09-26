### Data Protection Implementation and Processes

Data is classified and handled according to the {{companyShortName}} Data Handling
Specifications and Data Classification document.

Critical, confidential and internal data will be tagged upon creation, if
tagging is supported. Each tag maps to a data type defined in the data
classification scheme, which then maps to a protection level for encryption,
access control, backup, and retention. Data classification may alternatively be
identified by its location/repository. For example, source codes in {{companyShortName}}’s
{{sourceControl}} repos are considered “Internal” by default, even though a tag is not
directly applied to each source file.

Critical and confidential data is always stored and transmitted securely, using
approved encryption standards. More details are specified in {{companyShortName}}’s Data
Classification and Handling document.

All IT systems that process and store sensitive data follow the provisioning
process, configuration, change management, patching and anti-malware standards
as defined in [Configuration and Change Management document](ccm.md).

#### Customer/Production Data Protection

{{companyShortName}} hosts on Amazon Web Services in the US-East (Ohio) region by default.
Data is replicated across multiple regions for redundancy and disaster recovery.

All {{companyShortName}} employees, systems, and resources adhere to the following standards
and processes to reduce the risk of compromise of Production Data:

1. Implement and/or review controls designed to protect Production Data from
   improper alteration or destruction.
2. Ensure that confidential data is stored in a manner that supports user access
   logs and automated monitoring for potential security incidents.
3. Ensure {{companyShortName}} Customer Production Data is segmented and only accessible to
   Customer authorized to access data.
4. All Production Data at rest is stored on encrypted volumes using encryption
   keys managed by {{companyShortName}}. Encryption at rest is ensured through the use of
   automated deployment scripts referenced in [Configuration and Change Management](ccm.md).
5. Volume encryption keys and machines that generate volume encryption keys are
   protected from unauthorized access. Volume encryption key material is
   protected with access controls such that the key material is only accessible
   by privileged accounts.
6. Encrypted volumes use approved cipher algorithms, key strength, and key
   management process as defined in §12.3.1 above.
7. Raid volume drives are individually encrypted and assembled on boot requiring
   a manual input of the key to mount the encrypted volume.

#### Access

{{companyShortName}} employee access to production is guarded by an approval process and by
default is disabled. When access is approved, temporary access is granted that
allows access to production. Production access is reviewed by the security team
on a case by case basis.

#### Separation

Customer data is logically separated at the database/datastore level using a
unique identifier for the institution. The separation is enforced at the API
layer where the client must authenticate with a chosen institution and then the
customer unique identifier is included in the access token and used by the API
to restrict access to data to the institution. All database/datastore queries
then include the institution identifier.

#### Backup and Recovery

For details on the backup and recovery process, see controls and procedures
defined in [Data Management](data-mgmt.md).

#### Monitoring

{{companyShortName}} uses AWS CloudWatch/CloudTrail to monitor the entire cloud service
operation. If a system failure and alarm is triggered, key personnel are
notified by text, chat, and/or email message in order to take appropriate
corrective action. Escalation may be required and there is an on-call rotation
for major services when further support is necessary.

{{companyShortName}} uses a security agent to monitor production systems. The
agents monitor system activities, generate alerts on suspicious activities and
report on vulnerability findings to a centralized management console.

The security agent is installed on all on premise Linux servers. It is also
built into Amazon Machine Images (AMIs) for use in {{companyShortName}} AWS
environments.
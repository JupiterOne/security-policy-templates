### Production Data Access

The following requirements and controls are in place for accessing production
data by internal personnel:

- There is no pre-provisioned, persisted "internal" access to production data
  stores. Access such as direct SSH to the production database servers and
  direct access to data objects in production S3 buckets are prohibited.

- Access to customer data is granted on a per-account basis.

- Access requests follow the same production access processes. Access must be
  approved by both the data owner and the security team.

- Access to production data is granted only through an approved platform with
  strong centralized access control, with MFA.
  
- An audit list of who has access to which customer data is maintained and
  reviewed monthly. Access is revoked when no longer needed.

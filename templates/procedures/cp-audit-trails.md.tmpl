### Audit Trails and Application Security Events Logging Standard

{{companyShortName}} logging standards requires application and system logs to contain
sufficient information to determine **who did what, when, where** to ensure
recording of security and audit events and to generate evidence for unauthorized
activities.

All systems and software developed at {{companyShortName}} must have the following security
events logging enabled as part of or in addition to standard application
logging.

1. All security log events must have the following attributes at minimum:

    * Timestamp of the event (synchronized to approved time server)
    * Identifier of the principal performing the action (such as user ID)
    * Location including both origin (such as hostname/IP) and target (such as
      host/service/resource)
    * Activity or action (such as log in, log out, create, read, update, delete
      of a resource)
       - the action may be logged as and determined by the HTTP request method
         and the API endpoint 
    * Event description and additional details may be logged depending on the
      system or application 

2. The following types of security events must be logged at minimum:

    * User and group administration activities (user or group added, updated,
      deleted, access granted/revoked)
    * All login attempts, successful and unsuccessful including the source IP
      address
    * All interactive logoffs
    * Privileged actions (configuration changes, application shutdown/restart,
      software update etc)
    * Major application events (e.g. application failure, start and restart,
      shutdown)
    * Any and all actions performed on critical resources such as production
      data

3. All application and system logs must not include (removed or masked):

    * Any sensitive information, including
      {{#needStandardHIPAA}}protected health information (PHI),{{/needStandardHIPAA}}
      personally identifiable information (PII)

      - except for IP addresses
      - usernames/logins may/should be logged as part of authentication logging
      - for user action auditing, opaque IDs should be used instead of
        usernames/logins whenever possible

    * Authentication and session tokens, user credentials
  
4. Security events and audit logs must be:

    * Always accessible to the monitoring system/team
    * Protected from any changes
    * Monitored with alerting mechanism in place (including alert for not
      receiving log events for a certain period of time)

5. All {{companyShortName}} IT infrastructure must have system clock synchronized

*Examples of recommended application events for logging and their auditing purpose:*

Events                                                | Purpose
---------                                             | ---------
Client requests and server responses                  | forensics and debugging - details level is defined by application
Successful and unsuccessful login attempts            | authentication
Successful and failed access to application resources | authorization, escalation of privileges
Excessive amount of requests from the client          | brute-forcing, malicious bots, denial of service attacks
E-mails sent by an application                        | spamming, social engineering

*Details of the logging configuration is documented at*

* [Application Logging - documented on the Engineering Wiki]({{&devWikiURL}})
* [Identity and Access Activity Logs via Okta](https://developer.okta.com/docs/api/resources/system_log)
* [AWS Cloudtrail](https://docs.aws.amazon.com/awscloudtrail/latest/userguide/cloudtrail-log-file-examples.html)
* [AWS S3 Server Access Logs](https://docs.aws.amazon.com/AmazonS3/latest/dev/ServerLogs.html)
# Implementing OAuth 2.0 "On-Behalf-Of" flow using Okta client_credentials flow + InlineHooks
by using [Inline Hooks](https://developer.okta.com/docs/concepts/inline-hooks/), we can be easily extend Okta to model [OAuth 2.0 On-Behal-Of flow](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-on-behalf-of-flow).

When an API "A" requires a token to access API "B", it requests it from Okta using client_credentials flow. The request also passes the "assertion" (API "A"'s own JWT, JWT-A) as a query parameter. The inline hook re-validates the assertion, and if valid, patches the result back to the callback so that Okta will extend the client_credentials' JWT with JWT-A's claims.

The diagram below describes the inline hook interaction:
![alt text](images/InlineHook_OBO_Flow.png)

## Create a Lambda Function in AWS:
1. Clone this repo, then `npm install`
2. Run `npm run zip`
3. In the AWS Lambda Console:
    * Click **Create Function**
    * Select **Author From Scratch**
    * Runtime = **Node.js**
    * Click **Create Function** (let it automatically create an AMI role, or choose a pre-configured one)
    * In **Code entry type**, select **Upload a .zip file**
    * Upload the `.zip` file in the `/dist` 
4. The Lambda requires 2 environment variables. Get these from Okta:
|Variable|Value|
|ISSUER|Issuer String of the Authorization Server configured for API "B"|
|AUDIENCE|"Audience" configured for the Authorization Server|

## Create the Inline Hook service endpoint:
Expose the Lambda Function using Amazon API Gateway:
1. From the Amazon API Gateway Console/UI, click **Create API**
2. Accept all defaults, and provide a name for **API name**
3. Click **Create API**
4. On the next screen, click **Actions > Create Resource** and provide following values:
    * Resource name = **inline-hook**
    * Resource Path = **/inline-hook**
    * Click **Create Resource**
    * Click **Create Method**
        * Integration Type = **Lambda Function**
        * Use Lambda Proxy Integration = **Y**
        * Lambda Function = **The Lambda function we just created**
        * Click **Save**

## Setup Inline Hook
[Follow this guide](https://developer.okta.com/docs/concepts/inline-hooks/#inline-hook-setup) to complete the Okta Inline Hook setup.
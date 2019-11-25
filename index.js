const OktaJwtVerifier = require('@okta/jwt-verifier');
const queryString = require('query-string');

const oktaJwtVerifier = new OktaJwtVerifier({
    issuer: process.env.ISSUER
});

exports.handler = async (event) => {
    const eventBody = JSON.parse(event.body);

    let assertion = undefined
    try {
        const url = eventBody.data.context.request.url.value;
        const parsed = queryString.parse(url.split('?')[1]);
        assertion = await oktaJwtVerifier.verifyAccessToken(parsed.assertion, process.env.AUDIENCE)
    } catch(err) {
        assertion = err
    }

    let body = {
		"commands": [{
			"type": "com.okta.access.patch",
			"value": [
    			{
    				"op": "add",
    				"path": "/claims/assertion",
    				"value": assertion
    			}
			]
		}]
	}
    
    const response = {
        statusCode: 200,
        body: JSON.stringify(body),
    };
    return response;
};

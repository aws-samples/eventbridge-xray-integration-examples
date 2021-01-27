/*! Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *  SPDX-License-Identifier: MIT-0
 */

const AWSXRay = require('aws-xray-sdk')
const AWS = AWSXRay.captureAWS(require('aws-sdk'))
const eventBridge = new AWS.EventBridge()

exports.handler = async (event) => {
	console.log(JSON.stringify(event, null, 2))

	const ebEvent = { 
		Entries: [{
			Detail: JSON.stringify({
				apiEvent: event.queryStringParameters
			}),
			DetailType: 'Request',
			Source: process.env.EVENTSOURCE,
			Time: new Date
		}]
	}

	console.log('Sending to EventBridge: ', ebEvent)
	const result = await eventBridge.putEvents(ebEvent).promise()

	console.log('Result: ', JSON.stringify(result, null, 2))

	return {
		statusCode: 200
	}
}

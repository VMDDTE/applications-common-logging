import { isHealthUrl, isResourceUrl } from '../helpers/url-request'
import { buildLoggingUrl, buildBasicLogMessage } from './helper'

export default class VmdBaseLogger {
    constructor (logger) {
        if (!logger) {
            throw new Error('BaseLogger requires a logger')
        }

        this.logger = logger
    }

    logStandardInfo (correlationId, httpMethod, url, actionMessage, organisationReference, loggedInUserId) {
        const logMessage = buildLogMessage(correlationId, httpMethod, url, actionMessage)

        if (organisationReference) {
            logMessage.organisationReference = organisationReference
        }

        if (loggedInUserId) {
            logMessage.loggedInUserId = loggedInUserId
        }

        // We want to log health check and resources calls as debug, currently this is hapi format; may need reviewing
        const isHealthCheck = isHealthUrl(url)
        const isResource = isResourceUrl(url)

        if (isHealthCheck || isResource) {
            this.logger.debug(logMessage)
        } else {
            this.logger.info(logMessage)
        }
    }

    logStandardError (correlationId, httpMethod, url, actionMessage, errorStatusCode, errorData, errorMessage) {
        const logMessage = buildLogMessage(correlationId, httpMethod, url, actionMessage)

        logMessage.errorStatusCode = errorStatusCode
        logMessage.errorData = errorData
        // Error message is intended to sometime hold additional information
        logMessage.errorMessage = errorMessage

        this.logger.error(logMessage)
    }
}

function buildLogMessage (correlationId, httpMethod, url, actionMessage) {
    const logMessage = buildBasicLogMessage(correlationId)
    logMessage.url = buildLoggingUrl(httpMethod, url)
    logMessage.message = actionMessage

    return logMessage
}

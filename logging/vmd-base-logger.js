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
        const logMessage = buildBasicLogMessage(correlationId)
        logMessage.message = actionMessage
        logMessage.url = buildLoggingUrl(httpMethod, url)

        if (organisationReference) {
            logMessage.organisationReference = organisationReference
        }

        if (loggedInUserId) {
            logMessage.loggedInUserId = loggedInUserId
        }

        // We want to log health check and resources calls as debug
        const isHealthCheck = isHealthUrl(url)
        const isResource = isResourceUrl(url)

        if (isHealthCheck || isResource) {
            this.logger.debug(logMessage)
        } else {
            this.logger.info(logMessage)
        }
    }

    logStandardError (correlationId, httpMethod, url, actionMessage, statusCode, data, errorMessage) {
        const logMessage = buildBasicLogMessage(correlationId)
        logMessage.url = buildLoggingUrl(httpMethod, url)
        logMessage.message = actionMessage

        logMessage.statusCode = statusCode
        logMessage.data = data
        logMessage.errorMessage = errorMessage

        this.logger.error(logMessage)
    }
}

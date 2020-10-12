import { isHealthUrl, isResourceUrl } from '../helpers/url-request'

export class VmdBaseLogger {
    constructor (logger) {
        if (!logger) {
            throw new Error('BaseLogger requires a logger')
        }

        this.logger = logger
    }

    logStandardInfo (correlationId, url, message, organisationReference, loggedInUserId) {
        const logMessage = buildBasicLogMessage(correlationId)
        logMessage.message = message
        logMessage.url = url

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

    logStandardError (correlationId, message, statusCode, data, errorMessage) {
        const logMessage = buildBasicLogMessage(correlationId)
        logMessage.message = message
        logMessage.statusCode = statusCode
        logMessage.data = data
        logMessage.errorMessage = errorMessage

        this.logger.error(logMessage)
    }
}

function buildBasicLogMessage (correlationId) {
    const logMessage = {}
    // If a correlation id is provided then define it in the standard way
    if (correlationId) {
        logMessage.vmd = {
            correlationId: correlationId
        }
    }

    return logMessage
}

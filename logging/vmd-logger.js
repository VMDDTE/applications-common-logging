
import { buildLogger, buildRequestLogMessage, buildLogMessage } from './helpers'

export default class VmdLogger {
    constructor (serviceName, config, logDirectory = 'logs') {
        if (!serviceName) {
            throw new Error('VmdLogger requires a service name')
        }

        const isFileLogging = config.requiresFileLogging || false
        const logLevel = config.logLevel || 'info'
        this.logger = buildLogger(serviceName, isFileLogging, logDirectory, logLevel)
    }

    logRequestDebug (correlationId, httpMethod, url, actionMessage, properties) {
        const logMessage = buildRequestLogMessage(correlationId, httpMethod, url, actionMessage, properties)
        this.logger.debug(logMessage)
    }

    logRequestInfo (correlationId, httpMethod, url, actionMessage, properties) {
        const logMessage = buildRequestLogMessage(correlationId, httpMethod, url, actionMessage, properties)
        this.logger.info(logMessage)
    }

    logRequestError (correlationId, httpMethod, url, actionMessage, properties) {
        const logMessage = buildRequestLogMessage(correlationId, httpMethod, url, actionMessage, properties)
        this.logger.error(logMessage)
    }

    logDebug (message, properties) {
        const logMessage = buildLogMessage(message, properties)
        this.logger.debug(logMessage)
    }

    logInfo (message, properties) {
        const logMessage = buildLogMessage(message, properties)
        this.logger.info(logMessage)
    }

    logError (message, properties) {
        const logMessage = buildLogMessage(message, properties)
        this.logger.error(logMessage)
    }
}

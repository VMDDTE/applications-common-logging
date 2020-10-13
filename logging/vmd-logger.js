
import { buildLogger, buildLogMessage } from './helper'

export default class VmdLogger {
    constructor (serviceName, config, logDirectory = 'logs') {
        if (!serviceName) {
            throw new Error('HapiLogger requires a service name')
        }

        const isFileLogging = config.requiresFileLogging || false
        const logLevel = config.logLevel || 'info'
        this.logger = buildLogger(serviceName, isFileLogging, logDirectory, logLevel)
    }

    logStandardDebug (correlationId, httpMethod, url, actionMessage, properties) {
        const logMessage = buildLogMessage(correlationId, httpMethod, url, actionMessage, properties)
        this.logger.debug(logMessage)
    }

    logStandardInfo (correlationId, httpMethod, url, actionMessage, properties) {
        const logMessage = buildLogMessage(correlationId, httpMethod, url, actionMessage, properties)
        this.logger.info(logMessage)
    }

    logStandardError (correlationId, httpMethod, url, actionMessage, properties) {
        const logMessage = buildLogMessage(correlationId, httpMethod, url, actionMessage, properties)
        this.logger.error(logMessage)
    }
}

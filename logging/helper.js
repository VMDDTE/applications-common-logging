import cron from 'node-cron'
import path from 'path'
import fs from 'fs'
import simpleNodeLogger from 'simple-node-logger'

export function buildLogger (serviceName, isFileLogging, logDirectory, logLevel) {
    const nameOffset = serviceName.length + 1

    if (isFileLogging) {
        console.info('Creating rolling file logger')
        if (!fs.existsSync(logDirectory)) {
            fs.mkdirSync(logDirectory)
        }

        const rollingFileLoggerOptions = {
            level: logLevel,
            logDirectory,
            fileNamePattern: serviceName + '-<DATE>.log',
            dateFormat: 'YYYY.MM.DD'
        }

        const rollingFileLogger = simpleNodeLogger.createRollingFileLogger(rollingFileLoggerOptions)
        scheduleLogDeletion(rollingFileLogger, logDirectory, serviceName, nameOffset)
        return rollingFileLogger
    }

    console.info('Creating console logger')
    const simpleLogger = simpleNodeLogger.createSimpleLogger()
    simpleLogger.setLevel(logLevel)
    return simpleLogger
}

function scheduleLogDeletion (rollingFileLogger, logDirectory, service, nameOffset) {
    const cronSchedule = '0 0 * * *'
    // We have the log at this point, but force to console
    console.info(`Cron scheduling deletion of old log files: '${cronSchedule}'`)

    cron.schedule(cronSchedule, () => {
        deleteOldLogs(rollingFileLogger, logDirectory, service, nameOffset)
    })
}

function deleteOldLogs (rollingFileLogger, logDirectory, service, nameOffset) {
    rollingFileLogger.info('Begin deletion of old logs')

    fs.readdir(logDirectory, function (err, files) {
        if (err) {
            rollingFileLogger.error('error reading log files')
        } else {
            files.forEach(function (file) {
                if (file.startsWith(service)) {
                    const currentTime = new Date()
                    const weekFromNow = currentTime - (new Date().getTime() - (7 * 24 * 60 * 60 * 1000))
                    const parts = file.substring(nameOffset).split('.')
                    if (parts.length === 4) {
                        const year = parts[0]
                        const month = parts[1] - 1
                        const date = parts[2]
                        const fileTime = new Date(year, month, date)
                        if ((currentTime - fileTime) > weekFromNow) {
                            deleteFile(rollingFileLogger, logDirectory, file)
                        }
                    }
                }
            })
        }
    })
}

function deleteFile (rollingFileLogger, logDirectory, file) {
    rollingFileLogger.info('deleting log file', file)
    fs.unlink(path.join(logDirectory, file),
        function (err) {
            if (err) {
                rollingFileLogger.error(err)
            }
            rollingFileLogger.info('deleted log file: ' + file)
        })
}

export function buildLogMessage (correlationId, httpMethod, url, actionMessage, properties) {
    const logMessage = buildBasicLogMessage(correlationId)
    logMessage.url = buildLoggingUrl(httpMethod, url)
    logMessage.message = actionMessage
    logMessage.properties = properties

    return logMessage
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

function buildLoggingUrl (httpMethod, url) {
    return `[${httpMethod.toUpperCase()}] ${url}`
}

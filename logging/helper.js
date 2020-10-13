function buildLoggingUrl (httpMethod, url) {
    return `[${httpMethod.toUpperCase()}] ${url}`
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

export {
    buildLoggingUrl,
    buildBasicLogMessage
}

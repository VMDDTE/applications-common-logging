import cron from 'node-cron';
import { join } from 'path';
import { existsSync, mkdirSync, readdir, unlink } from 'fs';
import simpleNodeLogger, { ILoggerInstance } from 'simple-node-logger';

function deleteFile(
  rollingFileLogger: ILoggerInstance,
  logDirectory: string,
  file: string,
) {
  rollingFileLogger.info('deleting log file', file);

  unlink(join(logDirectory, file), (err) => {
    if (err) {
      rollingFileLogger.error(err.message);
    }

    rollingFileLogger.info(`deleted log file: ${file}`);
  });
}

function deleteOldLogs(
  rollingFileLogger: ILoggerInstance,
  logDirectory: string,
  service: string,
  nameOffset: number,
) {
  rollingFileLogger.info('Begin deletion of old logs');

  readdir(logDirectory, (err, files) => {
    if (err) {
      rollingFileLogger.error('error reading log files');
    } else {
      files.forEach((file) => {
        if (file.startsWith(service)) {
          const currentTime = new Date().getTime();
          const weekFromNow =
            currentTime - (new Date().getTime() - 7 * 24 * 60 * 60 * 1000);
          const parts = file.substring(nameOffset).split('.');

          if (parts.length === 4) {
            const year = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1;
            const date = parseInt(parts[2], 10);
            const fileTime = new Date(year, month, date).getTime();

            if (currentTime - fileTime > weekFromNow) {
              deleteFile(rollingFileLogger, logDirectory, file);
            }
          }
        }
      });
    }
  });
}

function scheduleLogDeletion(
  rollingFileLogger: ILoggerInstance,
  logDirectory: string,
  service: string,
  nameOffset: number,
) {
  const cronSchedule = '0 0 * * *';
  // We have the log at this point, but force to console
  console.info(`Cron scheduling deletion of old log files: '${cronSchedule}'`);

  cron.schedule(cronSchedule, () => {
    deleteOldLogs(rollingFileLogger, logDirectory, service, nameOffset);
  });
}

export function buildLogger(
  serviceName: string,
  isFileLogging: boolean,
  logDirectory = 'logs',
  logLevel = 'info',
): ILoggerInstance {
  const nameOffset = serviceName.length + 1;

  if (isFileLogging) {
    console.info('Creating rolling file logger');

    if (!existsSync(logDirectory)) {
      mkdirSync(logDirectory);
    }

    const rollingFileLoggerOptions = {
      dateFormat: 'YYYY.MM.DD',
      fileNamePattern: `${serviceName}-<DATE>.log`,
      level: logLevel,
      logDirectory,
    };

    const rollingFileLogger = simpleNodeLogger.createRollingFileLogger(
      rollingFileLoggerOptions,
    );

    scheduleLogDeletion(
      rollingFileLogger,
      logDirectory,
      serviceName,
      nameOffset,
    );

    return rollingFileLogger;
  }

  console.info('Creating console logger');

  const simpleLogger = simpleNodeLogger.createSimpleLogger();

  simpleLogger.setLevel(logLevel);

  return simpleLogger;
}

interface IRequestLogMessage<T> {
  httpVerb: string | null;
  message: string;
  properties: T;
  vmd?: {
    correlationId: string;
  };
  url: string;
}

export function buildRequestLogMessage<T>(
  correlationId: string,
  httpVerb: string,
  url: string,
  actionMessage: string,
  properties: T,
): IRequestLogMessage<T> {
  const logMessage: IRequestLogMessage<T> = {
    httpVerb: httpVerb ? httpVerb.toUpperCase() : null,
    message: actionMessage,
    properties,
    url,
  };

  if (correlationId) {
    logMessage.vmd = {
      correlationId,
    };
  }

  return logMessage;
}

interface ILogMessage<T> {
  message: string;
  properties: T;
}

export function buildLogMessage<T>(
  message: string,
  properties: T,
): ILogMessage<T> {
  return {
    message,
    properties,
  };
}

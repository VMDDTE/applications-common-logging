import { ILoggerInstance } from 'simple-node-logger';
import {
  buildLogger,
  buildRequestLogMessage,
  buildLogMessage,
} from './helpers';

interface ILoggerConfig {
  logLevel: string;
  requiresFileLogging?: boolean;
}

export default class VmdLogger {
  private logger: ILoggerInstance;

  constructor(
    serviceName: string,
    config: ILoggerConfig,
    logDirectory = 'logs',
  ) {
    if (!serviceName) {
      throw new Error('VmdLogger requires a service name');
    }

    const isFileLogging = config.requiresFileLogging || false;
    const logLevel = config.logLevel || 'info';

    this.logger = buildLogger(
      serviceName,
      isFileLogging,
      logDirectory,
      logLevel,
    );
  }

  public logRequestDebug<T>(
    correlationId: string,
    httpMethod: string,
    url: string,
    actionMessage: string,
    properties: T,
  ): void {
    const logMessage = buildRequestLogMessage(
      correlationId,
      httpMethod,
      url,
      actionMessage,
      properties,
    );

    this.logger.debug(logMessage);
  }

  public logRequestInfo<T>(
    correlationId: string,
    httpMethod: string,
    url: string,
    actionMessage: string,
    properties: T,
  ): void {
    const logMessage = buildRequestLogMessage(
      correlationId,
      httpMethod,
      url,
      actionMessage,
      properties,
    );

    this.logger.info(logMessage);
  }

  public logRequestError<T>(
    correlationId: string,
    httpMethod: string,
    url: string,
    actionMessage: string,
    properties: T,
  ): void {
    const logMessage = buildRequestLogMessage(
      correlationId,
      httpMethod,
      url,
      actionMessage,
      properties,
    );

    this.logger.error(logMessage);
  }

  public logDebug<T>(message: string, properties: T): void {
    const logMessage = buildLogMessage(message, properties);

    this.logger.debug(logMessage);
  }

  public logInfo<T>(message: string, properties: T): void {
    const logMessage = buildLogMessage(message, properties);

    this.logger.info(logMessage);
  }

  public logError<T>(message: string, properties: T): void {
    const logMessage = buildLogMessage(message, properties);

    this.logger.error(logMessage);
  }
}

import * as helpers from '../helpers';
import Logger from '../vmd-logger';

jest.spyOn(helpers, 'buildLogMessage');
jest.spyOn(helpers, 'buildRequestLogMessage');
jest.spyOn(helpers, 'buildLogger').mockReturnValue({
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  setLevel: jest.fn(),
  warn: jest.fn(),
});

describe('VMD logged', () => {
  let logger: Logger;
  let correlationId: string;
  let httpMethod: string;
  let url: string;
  let actionMessage: string;
  let properties: string[];

  beforeEach(() => {
    logger = new Logger('Unit test', {});
    correlationId = 'ABC123';
    httpMethod = 'GET';
    url = '/hello-world';
    actionMessage = 'TestingLogger';
    properties = ['Testing', '123'];
  });

  it('should throw an error if service name is not set', () => {
    expect(() => {
      logger = new Logger('', {});
    }).toThrowError('VmdLogger requires a service name');
  });

  it('should build the logger', () => {
    expect(helpers.buildLogger).toHaveBeenCalledWith(
      'Unit test',
      false,
      'logs',
      'info',
    );
  });

  it('should create a debug log when logRequestDebug is called', () => {
    logger.logRequestDebug(
      correlationId,
      httpMethod,
      url,
      actionMessage,
      properties,
    );

    expect(helpers.buildRequestLogMessage).toHaveBeenCalledWith(
      correlationId,
      httpMethod,
      url,
      actionMessage,
      properties,
    );
  });

  it('should create an info log when logRequestInfo is called', () => {
    logger.logRequestInfo(
      correlationId,
      httpMethod,
      url,
      actionMessage,
      properties,
    );

    expect(helpers.buildRequestLogMessage).toHaveBeenCalledWith(
      correlationId,
      httpMethod,
      url,
      actionMessage,
      properties,
    );
  });

  it('should create a warn log when logRequestWarn is called', () => {
    logger.logRequestWarn(
      correlationId,
      httpMethod,
      url,
      actionMessage,
      properties,
    );

    expect(helpers.buildRequestLogMessage).toHaveBeenCalledWith(
      correlationId,
      httpMethod,
      url,
      actionMessage,
      properties,
    );
  });

  it('should create an error log when logRequestError is called', () => {
    logger.logRequestError(
      correlationId,
      httpMethod,
      url,
      actionMessage,
      properties,
    );

    expect(helpers.buildRequestLogMessage).toHaveBeenCalledWith(
      correlationId,
      httpMethod,
      url,
      actionMessage,
      properties,
    );
  });

  it('should create a debug log when logDebug is called', () => {
    logger.logDebug(actionMessage, properties);

    expect(helpers.buildLogMessage).toHaveBeenCalledWith(
      actionMessage,
      properties,
    );
  });

  it('should create an info log when logInfo is called', () => {
    logger.logInfo(actionMessage, properties);

    expect(helpers.buildLogMessage).toHaveBeenCalledWith(
      actionMessage,
      properties,
    );
  });

  it('should create a warn log when logWarn is called', () => {
    logger.logWarn(actionMessage, properties);

    expect(helpers.buildLogMessage).toHaveBeenCalledWith(
      actionMessage,
      properties,
    );
  });

  it('should create an error log when logError is called', () => {
    logger.logError(actionMessage, properties);

    expect(helpers.buildLogMessage).toHaveBeenCalledWith(
      actionMessage,
      properties,
    );
  });
});

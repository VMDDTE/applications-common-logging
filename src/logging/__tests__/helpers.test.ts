import cron from 'node-cron';
import fs from 'fs';
import {
  buildLogger,
  buildLogMessage,
  buildRequestLogMessage,
} from '../helpers';

jest.mock('fs');

describe('Logging Helper', () => {
  describe('buildLogger', () => {
    beforeEach(() => {
      console.info = jest.fn();
    });

    it('should create file logger with defaults', () => {
      const cronSchedule = '0 0 * * *';

      const logger = buildLogger('testFileLogger', true);

      jest.spyOn(logger, 'info');

      expect(fs.mkdirSync).toHaveBeenCalledWith('logs');
      expect(console.info).toHaveBeenCalledWith('Creating rolling file logger');
      expect(cron.schedule).toHaveBeenCalledWith(
        cronSchedule,
        expect.any(Function),
      );
      expect(console.info).toHaveBeenCalledWith(
        `Cron scheduling deletion of old log files: '${cronSchedule}'`,
      );
      expect(logger.info).toHaveBeenCalledWith('Begin deletion of old logs');
    });

    it('should not create a directory if it already exists', () => {
      (fs.existsSync as jest.Mock).mockReturnValueOnce(true);

      buildLogger('testFileLogger', true);

      expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('should log an error if it is unable to read log file', () => {
      const logger = buildLogger('testFileLogger', true, 'err');

      expect(logger.error).toHaveBeenCalledWith('error reading log files');
    });

    // Could add tests to check file creation etc

    it('should create console logger', () => {
      buildLogger('testConsole', false);

      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith('Creating console logger');
    });
  });

  describe('buildLogMessage', () => {
    it('should return log message in correct format when properties are set', () => {
      const message = 'Hello world';
      const properties = {
        isTest: true,
      };
      const logMessage = buildLogMessage(message, properties);

      expect(logMessage).toEqual({
        message,
        properties,
      });
    });

    it('should return log message in correct format when properties are not set', () => {
      const message = 'Hello world';
      const logMessage = buildLogMessage(message);

      expect(logMessage).toEqual({
        message,
      });
    });
  });

  describe('buildRequestLogMessage', () => {
    it('should return log message in correct format when a correlation ID is set', () => {
      const correlationId = '12345';
      const actionMessage = 'someAction';
      const httpVerb = 'get';
      const url = 'test.url.com';
      const logMessage = buildRequestLogMessage(
        correlationId,
        httpVerb,
        url,
        actionMessage,
      );

      expect(logMessage).toEqual({
        httpVerb: 'GET',
        message: actionMessage,
        url,
        vmd: {
          correlationId,
        },
      });
    });

    it('should return log message in correct format when a correlation ID is set', () => {
      const actionMessage = 'someAction';
      const httpVerb = 'get';
      const url = 'test.url.com';
      const properties = {
        isTest: true,
      };
      const logMessage = buildRequestLogMessage(
        null,
        httpVerb,
        url,
        actionMessage,
        properties,
      );

      expect(logMessage).toEqual({
        httpVerb: 'GET',
        message: actionMessage,
        properties,
        url,
      });
    });
  });
});

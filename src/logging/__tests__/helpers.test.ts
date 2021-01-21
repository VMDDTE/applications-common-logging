import cron from 'node-cron';
import fs from 'fs';
import { buildLogger, buildLogMessage } from '../helpers';

jest.mock('fs');

describe('Logging Helper', () => {
  describe('#buildLogger', () => {
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

    // Could add tests to check file creation etc

    it('should create console logger', () => {
      buildLogger('testConsole', false);

      expect(console.info).toHaveBeenCalledTimes(1);
      expect(console.info).toHaveBeenCalledWith('Creating console logger');
    });
  });

  describe('#buildLogMessage', () => {
    it('should return log message in correct format', () => {
      const correlationId = '12345';
      const logMessage = buildLogMessage(correlationId, 'get');

      expect(logMessage).toEqual({
        message: correlationId,
        properties: 'get',
      });
    });
  });
});

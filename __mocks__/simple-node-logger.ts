const simpleNodeLogger = jest.genMockFromModule<{
  createRollingFileLogger: jest.Mock;
  createSimpleLogger: jest.Mock;
}>('simple-node-logger');

simpleNodeLogger.createRollingFileLogger = jest.fn(() => ({
  error: jest.fn(),
  info: jest.fn(),
}));

simpleNodeLogger.createSimpleLogger = jest.fn(() => ({
  setLevel: jest.fn(),
}));

module.exports = simpleNodeLogger;

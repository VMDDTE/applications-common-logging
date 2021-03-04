const nodeCron = jest.genMockFromModule<{
  schedule: jest.Mock;
}>('node-cron');

// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
nodeCron.schedule = jest.fn((_, callback) => callback());

module.exports = nodeCron;

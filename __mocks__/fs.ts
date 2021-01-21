const fs = jest.genMockFromModule<{
  existsSync: jest.Mock;
  mkdirSync: jest.Mock;
  readdir: jest.Mock;
}>('fs');

fs.existsSync = jest.fn().mockReturnValue(false);
fs.mkdirSync = jest.fn().mockReturnValue([]);
// eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call
fs.readdir = jest.fn((_, callback) => callback(null, []));

module.exports = fs;

/* eslint-disable @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-call */
const fs = jest.genMockFromModule<{
  existsSync: jest.Mock;
  mkdirSync: jest.Mock;
  readdir: jest.Mock;
}>('fs');

fs.existsSync = jest.fn().mockReturnValue(false);
fs.mkdirSync = jest.fn().mockReturnValue([]);
fs.readdir = jest.fn((dirName, callback) => {
  if (dirName === 'err') {
    callback('err');
  } else {
    callback(null, [
      'testFileLogger-file.log',
      'random-file.log',
      'testFileLogger-2021.01.25.log',
    ]);
  }
});

module.exports = fs;

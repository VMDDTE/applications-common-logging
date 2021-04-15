// simple-node-logger doesn't have any typings so we need to create our own
declare module 'simple-node-logger' {
  interface IRollingFileLoggerOpts {
    dateFormat: string;
    fileNamePattern: string;
    level: string;
    logDirectory: string;
  }

  interface ILoggerInstance {
    debug: (...message: unknown[]) => void;
    error: (...message: unknown[]) => void;
    info: (...message: unknown[]) => void;
    setLevel: (level: string) => void;
    warn: (...message: unknown[]) => void;
  }

  function createRollingFileLogger(
    opts: IRollingFileLoggerOpts,
  ): ILoggerInstance;
  function createSimpleLogger(): ILoggerInstance;
}

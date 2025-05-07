export interface LoggerInterface {
    info(msg: string): void;
    error(msg: string, err?: unknown): void;
  }

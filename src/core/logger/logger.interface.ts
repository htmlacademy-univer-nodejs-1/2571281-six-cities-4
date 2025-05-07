export interface Logger {
    info(message: string, ...params: unknown[]): void;
    warn(message: string, ...params: unknown[]): void;
    error(message: string, ...params: unknown[]): void;
    debug(message: string, ...params: unknown[]): void;
}

export class ErrorLogger {
  private readonly logName = 'Verified Client SDK';

  constructor() {}

  public log(message?: unknown, ...optionalParams: unknown[]): void {
    console.error(this.logName + ': ', message, ...optionalParams);
  }
}

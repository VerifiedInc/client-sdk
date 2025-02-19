export class ErrorLogger {
  private readonly logName = 'Verified Client SDK';

  constructor() {}

  public log(message?: any, ...optionalParams: any[]): void {
    console.error(this.logName + ': ', message, ...optionalParams);
  }
}

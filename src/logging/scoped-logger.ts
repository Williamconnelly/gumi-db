import { Logger } from './logger';

export class ScopedLogger extends Logger {

  constructor(
    className: string,
    protected readonly fnName: string
  ) {
    super(className);
  }

  public override info(message: string): void {
    super.info(message);
  }

  public override warn(message: string): void {
    super.warn(message);
  }

  public override error(message: string): void {
    super.error(message);
  }

  public override debug(message: string): void {
    super.info(message);
  }

  protected override format(message: string): string {
    return `[${this.className}.${this.fnName}]: ${message}`;
  }

}
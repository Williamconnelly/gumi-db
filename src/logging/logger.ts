import { ITimerStop } from './interfaces';

export class Logger {

  constructor(
    protected readonly className: string
  ) { }

  /**
 * Logs an informational message.
 * @param message - The message to log.
 * @param fnName - The function name to include in the log prefix.
 */
  public info(message: string): void;
  public info(message: string, fnName: string): void
  public info(message: string, fnName?: string): void {
    console.info(this.format(message, fnName));
  }

  /**
 * Logs a warning message.
 * @param message - The message to log.
 * @param fnName - The function name to include in the log prefix.
 */
  public warn(message: string): void
  public warn(message: string, fnName: string): void
  public warn(message: string, fnName?: string): void {
    console.warn(this.format(message, fnName));
  }

  /**
   * Logs an error message.
   * @param message - The message to log.
   * @param fnName - The function name to include in the log prefix.
   * @param err - The error to log. Defaults to 'Unknown Error'.
   */
  public error(message: string): void
  public error(message: string, fnName: string): void
  public error(message: string, fnName: string, err: unknown): void
  public error(message: string, fnName?: string, err?: unknown): void {
    console.error(this.format(message, fnName), err ?? 'Unknown Error');
  }

  /**
 * Logs a debug message.
 * @param message - The message to log.
 * @param fnName - The function name to include in the log prefix.
 */
  public debug(message: string): void
  public debug(message: string, fnName: string): void
  public debug(message: string, fnName?: string): void {
    console.debug(this.format(message, fnName));
  }

  /**
 * Creates a scoped logger that fixes the function name in all log prefixes.
 * @param fnName - The function name to scope all logs to.
 * @returns A {@link Logger} instance bound to the given function name.
 */
  public scope(fnName: string): ScopedLogger {
    return new ScopedLogger(this.className, fnName);
  }

  /**
 * Starts a timer for measuring the duration of a task.
 * @param task - A label describing the task being timed.
 * @returns An {@link ITimerStop} handle with a `stop` method to end the timer and log the duration.
 */
  public time(task: string, fnName: string): ITimerStop {
    const start: number = performance.now();

    return {
      stop: () => {
        const duration = (performance.now() - start).toFixed(2);

        this.info(`${task} completed in ${duration}ms`, fnName);
      },
    };
  }

  protected format(message: string, fnName?: string): string {
    const fnStub: string = fnName ? `.${fnName}` : '';

    return `[${this.className}${fnStub}]: ${message}`;
  }

}

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
    super.debug(message);
  }

  protected override format(message: string): string {
    return `[${this.className}.${this.fnName}]: ${message}`;
  }

}
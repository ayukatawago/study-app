type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerOptions {
  enabled: boolean;
  prefix?: string;
  level?: LogLevel;
}

const LOG_LEVELS: Record<LogLevel, number> = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const DEFAULT_OPTIONS: LoggerOptions = {
  enabled: process.env.NODE_ENV !== 'production',
  level: 'info',
};

class Logger {
  private options: LoggerOptions;

  constructor(options?: Partial<LoggerOptions>) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }

  private shouldLog(level: LogLevel): boolean {
    if (!this.options.enabled) return false;
    const configuredLevel = this.options.level || 'info';
    return LOG_LEVELS[level] >= LOG_LEVELS[configuredLevel];
  }

  private formatMessage(message: any): string {
    const prefix = this.options.prefix ? `[${this.options.prefix}] ` : '';
    return `${prefix}${message}`;
  }

  debug(message: any, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage(message), ...args);
    }
  }

  info(message: any, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage(message), ...args);
    }
  }

  warn(message: any, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage(message), ...args);
    }
  }

  error(message: any, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage(message), ...args);
    }
  }
}

export function createLogger(options?: Partial<LoggerOptions>): Logger {
  return new Logger(options);
}

export const defaultLogger = createLogger();

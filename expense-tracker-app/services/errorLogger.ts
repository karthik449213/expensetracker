interface ErrorLog {
  timestamp: string;
  message: string;
  stack?: string;
  context?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
}

class ErrorLogger {
  private logs: ErrorLog[] = [];
  private maxLogs = 50;

  log(
    message: string,
    error?: Error,
    context?: string,
    severity: 'low' | 'medium' | 'high' | 'critical' = 'medium'
  ) {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      message,
      stack: error?.stack,
      context,
      severity,
    };

    this.logs.push(errorLog);

    // Keep only latest logs
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }

    console.error(`[${severity.toUpperCase()}] ${message}`, error);

    // Send to external service in production
    if (severity === 'critical' || severity === 'high') {
      this.sendToExternalService(errorLog);
    }
  }

  private sendToExternalService(errorLog: ErrorLog) {
    // Implement Sentry, LogRocket, etc.
    // Example:
    // Sentry.captureException(errorLog);
  }

  getLogs(): ErrorLog[] {
    return this.logs;
  }

  clearLogs() {
    this.logs = [];
  }
}

export const errorLogger = new ErrorLogger();
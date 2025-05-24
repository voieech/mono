import pc from "picocolors";

type LogLevel = "Error" | "Info" | "Verbose";

function colorizeByLogLevel(level: LogLevel, text: string) {
  switch (level) {
    case "Error":
      return pc.red(text);
    case "Info":
      return pc.green(text);
    case "Verbose":
      return pc.gray(text);
    default:
      throw new Error("Invalid log level");
  }
}

/**
 * Super simple custom logger, might change to use pino/winston in the future.
 */
class Logger {
  private log(
    level: LogLevel,
    label: string,
    ...args: Parameters<typeof console.log>
  ) {
    const formattedLogOutput =
      `${$DateTime.now.asIsoDateTime()} ${level}: [${label}] ` +
      args.flat().join(" ");

    // Ignore eslint rule since this is used to implement logger itself
    console.log(colorizeByLogLevel(level, formattedLogOutput));
  }

  /**
   * Standard error log level, think of this like `console.error`
   */
  error(label: string, ...args: Parameters<typeof console.error>) {
    this.log("Error", label, args);
  }

  /**
   * Standard log level, think of this like `console.log`
   */
  info(label: string, ...args: Parameters<typeof console.log>) {
    this.log("Info", label, args);
  }

  /**
   * Verbose log level for none critical info, this still logs in all
   * environment, but can be easily filtered away / turned off in logs viewer.
   */
  verbose(label: string, ...args: Parameters<typeof console.log>) {
    this.log("Verbose", label, args);
  }
}

export const logger = new Logger();

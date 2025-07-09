import chalk from "chalk";

const prefix = chalk.bold.cyan("OpenAudit");

const label = {
  info: chalk.bgBlue.white.bold(" INFO "),
  success: chalk.bgGreen.white.bold(" SUCCESS "),
  error: chalk.bgRed.white.bold(" ERROR "),
  debug: chalk.bgGray.white.bold(" DEBUG "),
};

const icon = {
  info: "ℹ️",
  success: "✔",
  error: "✖",
  debug: "🐞",
};

export class Logger {
  constructor(private enabled: boolean) {}

  info(...args: any[]) {
    if (!this.enabled) return;
    console.log(
      `${prefix}  ${label.info}  ${chalk.cyan(icon.info)} ${chalk.cyan(...args)}`,
    );
  }

  success(...args: any[]) {
    if (!this.enabled) return;
    console.log(
      `${prefix}  ${label.success}  ${chalk.greenBright(icon.success)} ${chalk.greenBright(...args)}`,
    );
  }

  error(...args: any[]) {
    if (!this.enabled) return;
    console.error(
      `${prefix}  ${label.error}  ${chalk.redBright(icon.error)} ${chalk.redBright(...args)}`,
    );
  }

  debug(...args: any[]) {
    if (!this.enabled) return;
    console.log(
      `${prefix}  ${label.debug}  ${chalk.gray(icon.debug)} ${chalk.gray(...args)}`,
    );
  }
}

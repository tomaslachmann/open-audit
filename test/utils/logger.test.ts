import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { Logger } from "../../src/utils/logger";

describe("Logger", () => {
  let consoleLogSpy: ReturnType<typeof vi.spyOn>;
  let consoleErrorSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, "log").mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
    consoleLogSpy.mockRestore();
  });

  it("logs info message when enabled", () => {
    const logger = new Logger(true);
    logger.info("Info message");

    expect(consoleLogSpy).toHaveBeenCalled();
    const output = consoleLogSpy.mock.calls[0][0] as string;
    expect(output).toContain("Info message");
  });

  it("logs success message when enabled", () => {
    const logger = new Logger(true);
    logger.success("Success message");

    expect(consoleLogSpy).toHaveBeenCalled();
    const output = consoleLogSpy.mock.calls[0][0] as string;
    expect(output).toContain("Success message");
  });

  it("logs debug message only when enabled", () => {
    const logger = new Logger(true);
    logger.debug("Debug message");

    expect(consoleLogSpy).toHaveBeenCalled();
    expect(consoleLogSpy.mock.calls[0][0]).toContain("Debug message");
  });

  it("does not log debug message when disabled", () => {
    const logger = new Logger(false);
    logger.debug("Debug message");

    expect(consoleLogSpy).not.toHaveBeenCalled();
  });

  it("logs error message when enabled", () => {
    const logger = new Logger(true);
    logger.error("Error message");

    expect(consoleErrorSpy).toHaveBeenCalled();
    expect(consoleErrorSpy.mock.calls[0][0]).toContain("Error message");
  });
});

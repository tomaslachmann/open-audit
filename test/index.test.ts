import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { OpenAudit } from "../src/index";
import { Logger } from "../src/utils/logger";

// Create a mock object to return from `new Pool()`
const queryMock = vi.fn().mockResolvedValue({
  rows: [{ id: 1, action: "user.test" }],
});

const connectMock = vi.fn().mockResolvedValue({ release: () => {} });

vi.mock("pg", () => {
  return {
    Pool: vi.fn().mockImplementation(() => ({
      query: queryMock,
      connect: connectMock,
    })),
  };
});

describe("OpenAudit (real logger, mocked db)", () => {
  beforeEach(() => {
    // Reset OpenAudit internal adapter
    // @ts-ignore
    import("../src/index").then((mod) => (mod["adapter"] = null));
    vi.clearAllMocks();
  });

  it("should init and log successfully with logger output", async () => {
    const infoSpy = vi.spyOn(Logger.prototype, "info");
    const successSpy = vi.spyOn(Logger.prototype, "success");
    const debugSpy = vi.spyOn(Logger.prototype, "debug");

    await OpenAudit.init({
      provider: "postgresql",
      url: "postgres://user:pass@localhost:5432/fake",
      debug: true,
    });

    const result = await OpenAudit.log({
      action: "user.test",
      actorId: "tester",
    });

    expect(result).toEqual({ id: 1, action: "user.test" });

    expect(infoSpy).toHaveBeenCalledWith("Connecting to PostgreSQL...");
    expect(successSpy).toHaveBeenCalledWith("Connected to PostgreSQL.");
    expect(
      debugSpy.mock.calls.some((call) =>
        call.some(
          (arg) => typeof arg === "string" && arg.includes("Logged event"),
        ),
      ),
    ).toBe(true);
  });
});

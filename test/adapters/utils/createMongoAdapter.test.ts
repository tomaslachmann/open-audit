import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateMongoAdapter } from "../../../src/adapters/utils/createMongoAdapter";

describe("CreateMongoAdapter", () => {
  const connect = vi.fn();
  const execute = vi.fn();

  let adapter: CreateMongoAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new CreateMongoAdapter(connect, execute, true);
  });

  it("should connect and prepare collection on init", async () => {
    await adapter.init();
    expect(connect).toHaveBeenCalled();
  });

  it("should log event into MongoDB", async () => {
    const event = {
      action: "sync",
      entity: "job",
      payload: { status: "complete" },
    };

    await adapter.logEvent(event);
    expect(execute).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "sync",
        entity: "job",
      }),
    );
  });
});

import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreatePostgresAdapter } from "../../../src/adapters/utils/createPostgresAdapter";

describe("CreatePostgresAdapter", () => {
  const connect = vi.fn();
  const execute = vi.fn();

  let adapter: CreatePostgresAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new CreatePostgresAdapter(connect, execute, true);
  });

  it("should call connect and createTable on init", async () => {
    execute.mockResolvedValue({});
    await adapter.init();

    expect(connect).toHaveBeenCalled();
    expect(execute).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE"),
      [],
    );
  });

  it("should call execute with correct insert SQL and values", async () => {
    execute.mockResolvedValue({});
    const event = {
      action: "register",
      entity: "user",
      metadata: { email: "x@y.com" },
    };
    await adapter.logEvent(event);
    expect(execute).toHaveBeenCalled();
    const [sql, values] = execute.mock.calls[0];
    expect(sql).toMatch(/INSERT/);
    expect(values).toEqual(expect.any(Array));
  });
});

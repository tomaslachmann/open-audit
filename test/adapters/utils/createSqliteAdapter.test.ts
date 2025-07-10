import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateSqliteAdapter } from "../../../src/adapters/utils/createSqliteAdapter";

describe("CreateSqliteAdapter", () => {
  const connect = vi.fn();
  const execute = vi.fn();

  let adapter: CreateSqliteAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new CreateSqliteAdapter(connect, execute, true);
  });

  it("should initialize and create table", async () => {
    execute.mockResolvedValue({});
    await adapter.init();
    expect(connect).toHaveBeenCalled();
    expect(execute).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE"),
    );
  });

  it("should log event via insert", async () => {
    const event = {
      action: "read",
      entity: "setting",
      payload: { key: "theme" },
    };

    await adapter.logEvent(event);
    expect(execute).toHaveBeenCalled();
    const [sql, values] = execute.mock.calls[0];
    expect(sql).toMatch(/INSERT/);
    expect(values).toEqual(expect.any(Array));
  });
});

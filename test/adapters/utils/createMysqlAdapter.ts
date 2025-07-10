import { describe, it, expect, vi, beforeEach } from "vitest";
import { CreateMysqlAdapter } from "../../../src/adapters/utils/createMysqlAdapter";

describe("CreateMysqlAdapter", () => {
  const connect = vi.fn();
  const execute = vi.fn();

  let adapter: CreateMysqlAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new CreateMysqlAdapter(connect, execute, true);
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

  it("should insert audit event via execute()", async () => {
    const event = {
      action: "create",
      entity: "invoice",
      payload: { amount: 200 },
    };

    await adapter.logEvent(event);
    expect(execute).toHaveBeenCalled();
    const [sql, values] = execute.mock.calls[0];
    expect(sql).toMatch(/INSERT/);
    expect(values).toEqual(expect.any(Array));
  });
});

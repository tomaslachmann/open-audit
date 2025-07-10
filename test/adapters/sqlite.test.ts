import { describe, it, expect, vi, beforeEach } from "vitest";
import { BetterSqlite3Adapter } from "../../src/adapters/sqlite";

const mockPragma = vi.fn();
const mockExec = vi.fn();
const mockRun = vi.fn();
const mockPrepare = vi.fn(() => ({ run: mockRun }));

const mockDb = {
  pragma: mockPragma,
  prepare: mockPrepare,
  exec: mockExec,
};

describe("BetterSqlite3Adapter", () => {
  let adapter: BetterSqlite3Adapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new BetterSqlite3Adapter(mockDb as any, true);
  });

  it("should set WAL mode via PRAGMA on init", async () => {
    mockExec.mockResolvedValueOnce({}); // simulate table creation
    await adapter.init();
    expect(mockPragma).toHaveBeenCalledWith("journal_mode = WAL");
    expect(mockExec).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE"),
    );
  });

  it("should insert audit record via prepared statement", async () => {
    mockRun.mockResolvedValueOnce({});
    await adapter.logEvent({
      action: "access",
      entity: "file",
    });
    expect(mockPrepare).toHaveBeenCalledWith(expect.stringContaining("INSERT"));
    expect(mockRun).toHaveBeenCalledWith(expect.any(Array));
  });
});

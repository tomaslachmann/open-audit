import { describe, it, expect, vi, beforeEach } from "vitest";
import { MySQL2Adapter } from "../../src/adapters/mysql2";

const mockQuery = vi.fn();
const mockRelease = vi.fn();
const mockGetConnection = vi.fn(() =>
  Promise.resolve({ release: mockRelease }),
);

const mockPool = {
  getConnection: mockGetConnection,
  query: mockQuery,
};

describe("MySQL2Adapter", () => {
  let adapter: MySQL2Adapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new MySQL2Adapter(mockPool as any, true);
  });

  it("should initialize and test connection", async () => {
    mockQuery.mockResolvedValueOnce([{}]); // simulate table creation
    await adapter.init();
    expect(mockGetConnection).toHaveBeenCalled();
    expect(mockRelease).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE"),
      [],
    );
  });

  it("should insert audit record", async () => {
    mockQuery.mockResolvedValueOnce([{}]); // simulate insert
    await adapter.logEvent({
      action: "delete",
      entity: "comment",
    });
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT"),
      expect.any(Array),
    );
  });
});

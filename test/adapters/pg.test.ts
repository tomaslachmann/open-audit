import { describe, it, expect, vi, beforeEach } from "vitest";
import { PgAdapter } from "../../src/adapters/pg";

describe("PgAdapter", () => {
  let adapter: PgAdapter;
  const mockQuery = vi.fn();
  const mockRelease = vi.fn();

  const mockPool = {
    connect: vi.fn().mockResolvedValue({ release: mockRelease }),
    query: mockQuery,
  };

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new PgAdapter(mockPool as any, true);
  });

  it("should initialize successfully", async () => {
    mockQuery.mockResolvedValueOnce({}); // Simulate CREATE TABLE
    await adapter.init();
    expect(mockPool.connect).toHaveBeenCalled();
    expect(mockRelease).toHaveBeenCalled();
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("CREATE TABLE"),
      [],
    );
  });

  it("should insert audit event", async () => {
    mockQuery.mockResolvedValueOnce({ rowCount: 1 });
    await adapter.logEvent({
      action: "login",
      entity: "user",
    });
    expect(mockQuery).toHaveBeenCalledWith(
      expect.stringContaining("INSERT"),
      expect.any(Array),
    );
  });
});

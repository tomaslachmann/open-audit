import { describe, it, expect, vi, beforeEach } from "vitest";
import { MongoDBAdapter } from "../../src/adapters/mongodb";

const mockCreateIndex = vi.fn();
const mockInsertOne = vi.fn();
const mockCreateCollection = vi.fn();
const mockListCollections = vi.fn(() => ({
  toArray: vi.fn().mockResolvedValue([]), // simulate: collection doesn't exist
}));
const mockCollection = vi.fn(() => ({
  insertOne: mockInsertOne,
  createIndex: mockCreateIndex,
}));
const mockDb = vi.fn(() => ({
  listCollections: mockListCollections,
  createCollection: mockCreateCollection,
  collection: mockCollection,
}));

const mockConnect = vi.fn();

const mockClient = {
  connect: mockConnect,
  db: mockDb,
};

describe("MongoDBAdapter", () => {
  let adapter: MongoDBAdapter;

  beforeEach(() => {
    vi.clearAllMocks();
    adapter = new MongoDBAdapter(
      mockClient as any,
      "testdb",
      "audit_events",
      true,
    );
  });

  it("should initialize and create collection if not exists", async () => {
    await adapter.init();
    expect(mockConnect).toHaveBeenCalled();
    expect(mockDb).toHaveBeenCalledWith("testdb");
    expect(mockListCollections).toHaveBeenCalledWith({ name: "audit_events" });
    expect(mockCreateCollection).toHaveBeenCalledWith(
      "audit_events",
      expect.any(Object),
    );
  });

  it("should insert an audit record", async () => {
    await adapter.init();
    await adapter.logEvent({
      action: "delete",
      entity: "log",
    });
    expect(mockInsertOne).toHaveBeenCalledWith(
      expect.objectContaining({
        action: "delete",
        entity: "log",
      }),
    );
  });
});

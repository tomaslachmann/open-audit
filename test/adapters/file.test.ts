import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { FileAdapter } from "../../src/adapters/file";
import path from "path";

// Mock fs methods
vi.mock("fs/promises", () => ({
  mkdir: vi.fn(),
  readFile: vi.fn(),
  writeFile: vi.fn(),
}));

import * as fs from "fs/promises";

describe("FileAdapter", () => {
  const baseDir = "./test-logs";
  let adapter: FileAdapter;

  beforeEach(() => {
    adapter = new FileAdapter(baseDir, true); // debug enabled
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("should create base directory on init()", async () => {
    await adapter.init();

    expect(fs.mkdir).toHaveBeenCalledWith(baseDir, { recursive: true });
  });

  it("should write new log file if none exists", async () => {
    const mockReadFile = fs.readFile as unknown as ReturnType<typeof vi.fn>;
    mockReadFile.mockRejectedValueOnce(new Error("file not found"));

    const mockWriteFile = fs.writeFile as unknown as ReturnType<typeof vi.fn>;

    const event = { action: "user.login", actorId: "abc123" };
    await adapter.logEvent(event);

    const dateStr = new Date().toISOString().slice(0, 10);
    const expectedPath = path.join(baseDir, `${dateStr}.json`);

    expect(mockWriteFile).toHaveBeenCalledWith(
      expectedPath,
      expect.stringContaining('"action": "user.login"'),
      "utf-8",
    );
  });

  it("should append to existing file", async () => {
    const existing = [{ action: "user.logout", actorId: "xyz" }];
    const mockReadFile = fs.readFile as unknown as ReturnType<typeof vi.fn>;
    mockReadFile.mockResolvedValueOnce(JSON.stringify(existing));

    const mockWriteFile = fs.writeFile as unknown as ReturnType<typeof vi.fn>;

    const event = { action: "user.login", actorId: "abc123" };
    await adapter.logEvent(event);

    const written = mockWriteFile.mock.calls[0][1]; // the JSON string

    const parsed = JSON.parse(written);
    expect(parsed).toHaveLength(2);
    expect(parsed[1].action).toBe("user.login");
  });
});

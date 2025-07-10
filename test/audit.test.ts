import { describe, it, expect, vi, beforeEach } from "vitest";
import { OpenAudit } from "../src/audit";
import { PgAdapter } from "../src/adapters/pg";
import { MySQL2Adapter } from "../src/adapters/mysql2";
import { FileAdapter } from "../src/adapters/file";
import { AuditInitConfig } from "../src/adapters/types";

vi.mock("../src/adapters/pg", () => ({
  PgAdapter: vi.fn(() => ({
    init: vi.fn(),
  })),
}));

vi.mock("../src/adapters/mysql2", () => ({
  MySQL2Adapter: vi.fn(() => ({
    init: vi.fn(),
  })),
}));

vi.mock("../src/adapters/file", () => ({
  FileAdapter: vi.fn(() => ({
    init: vi.fn(),
  })),
}));

describe("OpenAudit.init (unit)", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should initialize PgAdapter for postgresql + pg", async () => {
    const config = {
      provider: "postgresql",
      driver: "pg",
      pool: {} as any,
      debug: true,
    } as const satisfies AuditInitConfig;
    await OpenAudit.init(config);
    expect(PgAdapter).toHaveBeenCalledWith(config.pool, config.debug);
  });

  it("should initialize MySQL2Adapter for mysql + mysql2", async () => {
    const config = {
      provider: "mysql",
      driver: "mysql2",
      pool: {} as any,
      debug: false,
    } as const satisfies AuditInitConfig;
    await OpenAudit.init(config);
    expect(MySQL2Adapter).toHaveBeenCalledWith(config.pool, config.debug);
  });

  it("should initialize FileAdapter for file", async () => {
    const config = {
      provider: "file",
      path: "./audit-log.json",
      debug: false,
    } as const satisfies AuditInitConfig;
    await OpenAudit.init(config);
    expect(FileAdapter).toHaveBeenCalledWith(config.path, config.debug);
  });
});

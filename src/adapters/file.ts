import fs from "fs/promises";
import path from "path";
import { BaseAdapter } from "./base";
import { AuditEvent } from "./types";

export class FileAdapter extends BaseAdapter {
  private baseDir: string;

  constructor(baseDir = "./audit_logs", debug = false) {
    super(debug);
    this.baseDir = baseDir;
  }

  async init(): Promise<void> {
    try {
      await fs.mkdir(this.baseDir, { recursive: true });
      this.log.success(
        `Directory ${this.baseDir} is ready for file-based audit logs.`,
      );
    } catch (err) {
      this.log.error("Failed to initialize FileAdapter.");
      console.error(err);
      throw err;
    }
  }

  async logEvent(event: AuditEvent): Promise<any> {
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10); // e.g. 2025-07-09
    const filePath = path.join(this.baseDir, `${dateStr}.json`);

    const fullEvent = {
      ...event,
      timestamp: now.toISOString(),
    };

    let existing: AuditEvent[] = [];

    try {
      const content = await fs.readFile(filePath, "utf-8");
      existing = JSON.parse(content);
    } catch {
      existing = [];
    }

    existing.push(fullEvent);

    await fs.writeFile(filePath, JSON.stringify(existing, null, 2), "utf-8");

    this.log.debug(`Logged event to file: ${filePath}`);
    return fullEvent;
  }
}

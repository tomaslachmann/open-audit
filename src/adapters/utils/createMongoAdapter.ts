import type { AdapterInterface, AuditEvent } from "../types";
import { BaseAdapter } from "../base";

export class CreateMongoAdapter
  extends BaseAdapter
  implements AdapterInterface
{
  private connect: () => Promise<void>;
  private insert: (event: AuditEvent & { timestamp: Date }) => Promise<any>;

  constructor(
    connect: () => Promise<void>,
    insert: (event: AuditEvent) => Promise<any>,
    debug = false,
  ) {
    super(debug);
    this.connect = connect;
    this.insert = insert;
  }

  async init() {
    this.logger.info("Initializing MongoDB adapter...");

    try {
      await this.connect();
      this.logger.success("Connected to MongoDB.");
    } catch (err) {
      this.logger.error("Failed to initialize MongoDB adapter.");
      console.error(err);
      throw err;
    }
  }

  async logEvent(event: AuditEvent) {
    const result = await this.insert({
      ...event,
      timestamp: new Date(),
    });
    this.log("Logged event:", result);
    return result;
  }
}

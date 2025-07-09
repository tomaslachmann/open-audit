import { Logger } from "../utils/logger";
import { AuditEvent } from "./types";

export abstract class BaseAdapter {
  public logger: Logger;

  constructor(protected debug = false) {
    this.logger = new Logger(debug);
  }

  abstract init(): Promise<void>;
  abstract logEvent(event: AuditEvent): Promise<any>;

  protected log(...args: any[]) {
    this.logger.debug(JSON.stringify(args));
  }
}

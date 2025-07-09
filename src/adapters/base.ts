import { Logger } from "../utils/logger";

export abstract class BaseAdapter {
  protected log: Logger;

  constructor(protected debug = false) {
    this.log = new Logger(debug);
  }

  abstract init(): Promise<void>;
  abstract logEvent(event: {
    actorId?: string;
    action: string;
    entity?: string;
    entityId?: string;
    metadata?: object;
  }): Promise<any>;
}

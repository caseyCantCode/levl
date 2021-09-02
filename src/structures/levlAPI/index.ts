import config from "../../config.json";
import fetch from "node-fetch";
export class levlAPI {
  async request(route) {
    const res = await fetch(`http://localhost:${config.api.port}${route}`);
    const json = await res.json().catch(() => null);
    return json;
  }
}

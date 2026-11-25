import { Redis } from "@upstash/redis";

class MemoryRedis {
  constructor() {
    this.store = new Map();
  }

  async get(key) {
    const item = this.store.get(key);
    if (!item) return null;
    if (item.expiresAt && Date.now() > item.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return item.value;
  }

  async set(key, value, opts = {}) {
    let expiresAt = null;
    if (opts && typeof opts.ex === "number") {
      expiresAt = Date.now() + opts.ex * 1000;
    }
    this.store.set(key, { value, expiresAt });
    return "OK";
  }

  async del(key) {
    this.store.delete(key);
    return 1;
  }

  async ttl(key) {
    const item = this.store.get(key);
    if (!item || !item.expiresAt) return -1;
    const remaining = Math.ceil((item.expiresAt - Date.now()) / 1000);
    return remaining > 0 ? remaining : -2;
  }

  async incr(key) {
    const item = this.store.get(key);
    let val = 0;
    let expiresAt = null;
    if (item) {
      if (item.expiresAt && Date.now() > item.expiresAt) {
        this.store.delete(key);
      } else {
        val = Number(item.value) || 0;
        expiresAt = item.expiresAt;
      }
    }
    val += 1;
    this.store.set(key, { value: val, expiresAt });
    return val;
  }
}

// Global persistent memory store for the server process lifecycle
const memoryStore = new MemoryRedis();

class ResilientRedis {
  constructor(upstashClient, memoryStore) {
    this.client = upstashClient;
    this.memory = memoryStore;
    this.upstashDisabled = false;
  }

  async exec(method, ...args) {
    if (this.upstashDisabled || !this.client) {
      return this.memory[method](...args);
    }
    try {
      return await this.client[method](...args);
    } catch (err) {
      console.warn(
        `[Upstash Redis warning] ${method} failed (${err.message}). Falling back to local in-memory store.`
      );
      this.upstashDisabled = true;
      return this.memory[method](...args);
    }
  }

  get(key) {
    return this.exec("get", key);
  }
  set(key, val, opts) {
    return this.exec("set", key, val, opts);
  }
  del(key) {
    return this.exec("del", key);
  }
  ttl(key) {
    return this.exec("ttl", key);
  }
  incr(key) {
    return this.exec("incr", key);
  }
}

let redisInstance = null;

export function getRedis() {
  if (redisInstance) return redisInstance;

  const url = process.env["UPSTASH_REDIS_REST_URL"];
  const token = process.env["UPSTASH_REDIS_REST_TOKEN"];

  let upstash = null;
  if (url && token) {
    try {
      upstash = new Redis({ url, token });
    } catch (err) {
      console.warn("[Upstash Redis] Failed to initialize client:", err.message);
    }
  }

  redisInstance = new ResilientRedis(upstash, memoryStore);
  return redisInstance;
}

export function otpCodeKey(email) {
  return `otp:code:${email}`;
}

export function otpRateKey(email) {
  return `otp:rate:${email}`;
}

export function otpHourKey(email) {
  return `otp:hour:${email}`;
}

export function otpVerifiedKey(email) {
  return `otp:verified:${email}`;
}

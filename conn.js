import redis from "redis";

class Cache {
  CacheBuilder = async () => {
    try {
      let RedisCache = redis.createClient({ url: `redis://127.0.0.1:6379` });
      RedisCache.on("error", (err) => {
        console.error("Redis Client has some error", err);
      });

      RedisCache.on("ready", () => {
        console.log("Redis Client is Ready" + " - RW");
      });

      await RedisCache.connect();

      return RedisCache;
    } catch (err) {
      console.log(err);
      new Error("Redis Server Error!");
    }
  };
}

export default Cache;

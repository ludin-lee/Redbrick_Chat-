import redis from "redis";

let redisCache;

async function redisClientBuilder() {
  try {
    redisCache = redis.createClient({ url: process.env.REDIS_URL });
    redisCache.on("error", (err) => {
      console.error("Redis Client has some error", err);
    });

    redisCache.on("ready", () => {
      console.log("Redis Client is Ready" + " - RW");
    });

    await redisCache.connect();
  } catch (e) {
    console.error(e);
    await redisCache.disconnect();
  }
}
redisClientBuilder();

export default redisCache;

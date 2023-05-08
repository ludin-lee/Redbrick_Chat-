import redis from "redis";

class Redis {
  constructor() {
    this.redisClient = redis.createClient();
    this.redisClient.on("connect", () => {
      console.info("Redis PubSub connected!");
    });
    this.redisClient.on("error", (err) => {
      console.error("Redis PubSub Client Error", err);
    });

    this.redisClient.on("pmessage", (pattern, channel, key) => {
      console.log(`Key "${key}" has been modified.`);
      // 변경 사항에 대한 추가 처리 로직을 여기에 작성합니다.
    });

    this.redisClient.connect().then(); // redis v4 연결 (비동기)
  }
}

class PubSub extends Redis {
  constructor() {
    super();
  }

  async subscribe(channel) {
    await this.redisClient.subscribe(channel, (message) => {
      console.log("message : ", message);
    });
    console.log("채널 연결 완료");
  }

  async unsubscribe(channel) {
    await this.redisClient.unsubscribe(channel);
  }

  async pSubscribe(channel) {
    await this.redisClient.pSubscribe(channel, (message, channel) => {
      console.log("channel : %s , message : %s", channel, message);
    });
    console.log("채널(패턴) 연결 완료");
  }

  async pUnsubscribe(channel) {
    await this.redisClient.pUnsubscribe(channel);
  }

  async publish(channel, message) {
    await this.redisClient.publish(channel, message);
  }
}

export default PubSub;

const Redis = require('ioredis');
const CF = require('../cf');

const redis = new Redis(CF.redis());
redis.on('ready', function () {
   console.log('redis ready')
});
module.exports = {
   get (key) {
      return redis.get(key);
   },
   set (key, value, expireSecond = -1) {
      // -1应该是永不过期
      return redis.set(key, value, 'EX', expireSecond);
   }
};


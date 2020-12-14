const Redis = require('ioredis');
const CF = require('../cf');
const uuid = require('uuid');
const redis = new Redis(CF.redis());
redis.on('ready', function () {
   console.log('redis ready');
});
redis.defineCommand('release', {
   numberOfKeys: 1,
   lua: `if redis.call('get', KEYS[1]) == ARGV[1] then return redis.call('del', KEYS[1]) else return 0 end`
})
/*
* [EX seconds] [PX milliseconds]
*/
const ExpireMode = {
   EX: 'EX',
   PX: 'PX'
};
/**
 * NX – Only set the key if it does not already exist.
 * XX – Only set the key if it already exist.
 */
const SetMode = {
   NX: 'NX',
   XX: 'XX'
};
const me = {
   get(key) {
      return redis.get(key);
   },
   set(key, value) {
      return redis.set(key, value);
   },
   // -1应该是永不过期
   setEx(key, value, expireSecond = -1) {
      return redis.set(key, value, ExpireMode.EX, expireSecond);
   },
   setExNx(key, value, expireSecond = -1) {
      return redis.set(key, value, ExpireMode.EX, expireSecond, SetMode.NX);
   },
   del(key) {
      return redis.del(key);
   },
   incr(key) {
      return redis.incr(key);
   },
   expireEx(key, expireSecond) {
      return redis.expire(key, expireSecond);
   },
   async lock (key, expireSecond = 3) {
      let uniqueId = uuid.v1();
      let ok = await me.setExNx(key, uniqueId, expireSecond);
      if (ok) {
         return function() {
            return redis.release(key, uniqueId)
         }
      }
      return false;
   }
};
module.exports = me;;


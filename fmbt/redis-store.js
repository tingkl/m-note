const Redis = require("./db/redis");
const { Store } = require("koa-session2");
 
class RedisStore extends Store { 
    async get(sid, ctx) {
        // console.log('get', sid)
        let data = await Redis.get(`SESSION:${sid}`);
        return JSON.parse(data);
    }
 
    async set(session, { sid =  this.getID(24), maxAge = 1000000 } = {}, ctx) {
        // console.log('set', sid, maxAge)
        try {
            // Use redis set EX to automatically drop expired sessions
            await Redis.setEx(`SESSION:${sid}`, JSON.stringify(session), maxAge / 1000);
        } catch (e) {
            console.error(e)
        }
        return sid;
    }
 
    destroy(sid, ctx) {
        // console.log('destroy', sid)
        return Redis.del(`SESSION:${sid}`);
    }
}
 
module.exports = RedisStore;
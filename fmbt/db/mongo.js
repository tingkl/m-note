const mongoose = require('mongoose');
const db = require('../cf').mongodb();
const CodeMsg = require('../code-msg');
const Exception = require('../exception');
mongoose.Promise = Promise;
mongoose.set('debug', process.env.NODE_ENV !== 'prod');
// mongoose.set('debug', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useNewUrlParser', true);
mongoose.connect(db.url, db.option).then(() => {
    console.log('db connect!', db.url);
});
mongoose.connection.on('disconnected', () => {});
mongoose.connection.on('error', err => {
    console.log(err);
});
class Mongo {
    constructor(schema, other) {
        let dbName = this.getName();
        let Schema = new mongoose.Schema(schema, {collection: dbName, writeConcern: true});
        this.fields = Object.assign(other ? other(Schema) : {}, {__v: 0});
        this.model = mongoose.model(dbName, Schema);
        // this.model.init()只会初始化有index或者unique的collection
        this.model.createCollection().then(function(collection) {
            console.log('dbName:', dbName, 'ready!');
        }).catch(function (e) {
            console.warn(e.errmsg);
        });
    }
    getName () {
        return this.constructor.name;
    }
    getSession() {
        return mongoose.startSession();
    }
    aggregate (condition, page) {
        let Model = this.model;
        if (page) {
            if (page.current < 1) {
                page.current = 1;
            }
            if (page.size < 1) {
                page.size = 10;
            }
            page.current = page.current - 1;
            condition.push({
                $skip: page.current * page.size,
            });
            condition.push({
                $limit: page.size
            });
            page.current = page.current + 1;
        }
        return Model.aggregate(condition);
    }
    deleteMany (condition) {
        let Model = this.model;
        return Model.deleteMany(condition)
    }
    save (data, opts) {
        let Model = this.model;
        let newEntity = new Model(data);
        // 防止影响到async，只返回err和doc
        // todo 测试返回err， entity， other
        return newEntity.save(opts);
    }
    findOne (condition, sort, fields) {
        let Model = this.model;
        fields = fields || this.fields;
        if (sort) {
            return Model.findOne(condition).sort(sort).select(fields);
        } else {
            return Model.findOne(condition).select(fields);
        }
    }
    findById (id, fields) {
        let Model = this.model;
        fields = fields || this.fields;
        return Model.findById(id, fields);
    }
    find (condition, sort, fields) {
        let Model = this.model;
        fields = fields || this.fields;
        if (sort) {
            return Model.find(condition).sort(sort).select(fields);
        } else {
            return Model.find(condition).select(fields);
        }
    }
    // 无需sort时，必须传false
    async findWithPage (condition, page, sort, fields) {
        let Model = this.model;
        fields = fields || this.fields;
        if (page.current < 1) {
            page.current = 1;
        }
        if (page.size < 1) {
            page.size = 10;
        }
        page.current = page.current - 1;
        let promiseCount = Model.countDocuments(condition);
        let promiseFind;
        if (sort) {
            promiseFind = Model.find(condition).sort(sort).skip(page.current * page.size).limit(page.size).select(fields);
        } else {
            promiseFind = Model.find(condition).skip(page.current * page.size).limit(page.size).select(fields);
        }
        let result = await Promise.all([promiseCount, promiseFind]);
        let total = result[0];
        page.current = page.current + 1;
        page.total = total;
        return result[1];
    }
    async findWithNo (condition, no, fields) {
        if (no && ['down', 'up'].includes(no.flag) && no.hasOwnProperty('maxNo') && no.hasOwnProperty('minNo')) {
            if (!no.size) {
                no.size = 10;
            }
            let result;
            let Model = this.model;
            fields = fields || this.fields;
            if (no.maxNo < 1 || no.minNo < 1) {
                // no.maxNo < 1时 或者 no.minNo < 1事，是第一次拉取，需要更新maxNo与minNo
                // doc.no降序排列才能拿到最新的,maxDoc为第一个doc，minDoc为最后一个doc
                // 5
                // 4
                // 3
                // 2
                // 1
                result = await Model.find(condition).sort({no: -1}).limit(no.size).select(fields);
                if (result && result.length > 0) {
                    no.maxNo = result[0].no;
                    no.minNo = result[result.length - 1].no;
                }
            } else if (no.flag === 'down') {
                // down是下拉，拿最新的数据，也就是no大的，因为no更大了，需要更新maxNo
                // 拿doc.no > no.maxNo的数据，doc.no升序排列才能拿到最新的，result.reverse后，maxDoc为第一个doc，minDoc为最后一个doc
                // 11
                // 12
                // 13
                // 14
                // 15
                condition.no = {$gt: no.maxNo};
                // 升序拿去，大于maxNo的，然后结果reverse
                result = await Model.find(condition).sort({no: 1}).limit(no.size).select(fields);
                if (result && result.length > 0) {
                    result = result.reverse();
                    no.maxNo = result[0].no;
                }
            } else if (no.flag === 'up') {
                // up是上推，拿老一些数据，也就是no小的数据，因为no更小了，需要更新minNo
                // 拿doc.no < no.minNo的数据，doc.no升序排列才能拿到老一些的数据，maxDoc为第一个doc，minDoc为最后一个doc
                // 15
                // 14
                // 13
                // 12
                // 11
                condition.no = {$lt: no.minNo};
                result = await Model.find(condition).sort({no: -1}).limit(no.size).select(fields);
                if (result && result.length > 0) {
                    no.minNo = result[result.length - 1].no;
                }
            }
            return result;
        } else {
            throw new Exception(CodeMsg.PageNo);
        }
    }
    // 更新都应返回更新后的数据
    findOneAndUpdate (condition, update, opts = {}) {
        let Model = this.model;
        // 查询和删除都是可以的，但是更新是不能更新不存在的doc
        // todo 修改失败，信息不存在
        return Model.findOneAndUpdate(condition, update, {new: true, fields: this.fields, ...opts});
    }
    // 更新都应返回更新后的数据
    findByIdAndUpdate (id, update, opts = {}) {
        let Model = this.model;
        delete update._id;
        // 查询和删除都是可以的，但是更新是不能更新不存在的doc
        // todo 修改失败，信息不存在
        return Model.findByIdAndUpdate(id, update, {new: true, fields: this.fields, ...opts});
    }
    // 更新都应返回更新后的数据
    updateOrCreate (condition, update, opts = {}) {
        let Model = this.model;
        // setDefaultsOnInsert: true， 如果是新建则使用default的值初始化字段
        return Model.findOneAndUpdate(condition, update, {new: true, upsert: true, setDefaultsOnInsert: true,  fields: this.fields, ...opts});
    }
    updateMany(condition, update, opts = {}) {
        let Model = this.model;
        return Model.updateMany(condition, update, opts);
    }
    updateOne(condition, update, opts = {}) {
        let Model = this.model;
        return Model.updateOne(condition, update, opts);
    }
    count (condition) {
        let Model = this.model;
        return Model.countDocuments(condition);
    }
    distinct (field, condition) {
        let Model = this.model;
        return Model.distinct(field, condition);
    }
    findOneAndRemove (condition) {
        let Model = this.model;
        return Model.findOneAndRemove(condition);
    }
}
Object.assign(Mongo, {
    Types: mongoose.Schema.Types
    // _Types: mongoose.Types
});
module.exports = Mongo;

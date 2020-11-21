const mysql = require('mysql');
const CF = require('../cf');
const CodeMsg = require('../code-msg');
const Exception = require('../exception');
let {host, user, password, database} = CF.mysql();
const pool = mysql.createPool({
    connectionLimit: 10,
    host,
    user,
    password,
    database,
    // debug: true,
    debug: CF.isProd() ? ['ComQueryPacket'] : ['ComQueryPacket', 'RowDataPacket', 'OkPacket']
});
console.log('mysql connect!', host + ':' + database);

class MySql {
    constructor(table) {
        this.table = (table || this.constructor.name.toLowerCase());
        this.converField = false;
        this.hook();
        console.log('mysql table:', this.table, 'ready!');
    }

    hook() {
        console.log(this.table, 'default hook');
    }

    parse(item, optField) {
        if (item) {
            let parseField = optField || this.converField;
            if (parseField instanceof Array) {
                console.log(this.table, 'parse', parseField);
                parseField.forEach(field => {
                    if (item.hasOwnProperty(field)) {
                        let val = item[field];
                        if (val) {
                            item[field] = JSON.parse(val);
                        }
                    }
                });
            }
        }
    }

    stringify(item, optField) {
        if (item) {
            let stringifyField = optField || this.converField;
            if (stringifyField instanceof Array) {
                stringifyField.forEach(field => {
                    console.log(this.table, 'stringify', stringifyField);
                    if (item.hasOwnProperty(field)) {
                        let val = item[field];
                        if (val instanceof Array || typeof val === 'object') {
                            item[field] = JSON.stringify(val);
                        }
                    }
                })
            }
        }
    }

    async query({sql, values, connection, extra} = {}) {
        return new Promise((resolve, reject) => {
            let cb = function (error, result, fields) {
                if (error) {
                    reject(error);
                } else {
                    extra && (extra['fields'] = fields);
                    resolve(result);
                }
            };
            let params = {sql, values};
            if (connection) {
                connection.query(params, cb);
            } else {
                pool.query(params, cb);
            }
        });
    }

    async select({fields, whereSql, whereValues, orderSql, connection, extra} = {}) {
        let fieldSql = '*';
        if (fields && fields.length > 0) {
            fieldSql = fields.join(', ');
        }
        let sql = `select ${fieldSql} from ${this.table}`;
        if (whereSql) {
            sql = `${sql} where ${whereSql}`;
        }
        if (orderSql) {
            sql = `${sql} order by ${orderSql}`;
        }
        let result = await this.query({sql, values: whereValues, connection, extra});
        if (this.converField) {
            result.forEach(item => this.parse(item));
        }
        return result;
    }

    async selectOne({fields, whereSql, whereValues, orderSql, connection, extra, easy}) {
        let list = await this.select({fields, whereSql, whereValues, orderSql, connection, extra});
        // easy = false 用于限定筛选的结果只可以出现一条记录
        if (!easy && list.length > 1) {
            throw new Exception(CodeMsg.NotOne);
        }
        // select已经parse过
        return list[0];
    }

    async count({whereSql, whereValues, connection, extra, easy}) {
        let sql = `select count(*) from ${this.table}`;
        if (whereSql) {
            sql = `${sql} where ${whereSql}`;
        }
        let result = await this.query({sql, values: whereValues, connection, extra});
        return result[0]['count(*)'];
    }

    async selectNo({fields, whereSql, whereValues, connection, no, noField = 'id'}) {
        let fieldSql = '*';
        if (fields && fields.length > 0) {
            fieldSql = fields.join(', ');
        }
        if (no && ['down', 'up'].includes(no.flag) && no.hasOwnProperty('maxNo') && no.hasOwnProperty('minNo')) {
            if (!no.size) {
                no.size = 10;
            }
            let sql = `select ${fieldSql} from ${this.table}`;
            if (whereSql) {
                sql = `${sql} where ${whereSql}`;
            }
            let result;
            if (no.maxNo < 1 || no.minNo < 1) {
                // no.maxNo < 1时 或者 no.minNo < 1时，是第一次拉取，需要更新maxNo与minNo
                // doc.id降序排列才能拿到最新的,maxDoc为第一个doc，minDoc为最后一个doc
                // 5
                // 4
                // 3
                // 2
                // 1
                sql = `${sql} order by ${noField} desc limit ${no.size}`;
                result = await this.query(({sql, values: whereValues, connection}));
                if (result && result.length > 0) {
                    no.maxNo = result[0][noField];
                    no.minNo = result[result.length - 1][noField];
                }
            } else if (no.flag === 'down') {
                // down是下拉，拿最新的数据，也就是no大的，因为no更大了，需要更新maxNo
                // 拿doc.no > no.maxNo的数据，doc.no升序排列才能拿到最新的，result.reverse后，maxDoc为第一个doc，minDoc为最后一个doc
                // 11
                // 12
                // 13
                // 14
                // 15
                whereValues.push(no.maxNo);
                if (whereSql) {
                    sql = `${sql} and ${noField} > ?`;
                } else {
                    sql = `${sql} where ${noField} > ?`;
                }
                sql = `${sql} order by ${noField} asc limit ${no.size}`;
                // 升序拿取，大于maxNo的，然后结果reverse
                result = await this.query(({sql, values: whereValues, connection}));
                if (result && result.length > 0) {
                    result = result.reverse();
                    no.maxNo = result[0][noField];
                }
            } else if (no.flag === 'up') {
                // up是上推，拿老一些数据，也就是no小的数据，因为no更小了，需要更新minNo
                // 拿doc.no < no.minNo的数据，doc.no降序排列才能拿到老一些的数据，maxDoc为第一个doc，minDoc为最后一个doc
                // 15
                // 14
                // 13
                // 12
                // 11
                whereValues.push(no.minNo);
                if (whereSql) {
                    sql = `${sql} and ${noField} < ?`;
                } else {
                    sql = `${sql} where ${noField} < ?`;
                }
                sql = `${sql} order by ${noField} desc limit ${no.size}`;
                result = await this.query(({sql, values: whereValues, connection}));
                if (result && result.length > 0) {
                    no.minNo = result[result.length - 1][noField];
                }
            }
            if (this.converField) {
                result.forEach(item => this.parse(item));
            }
            return result;
        } else {
            throw new Exception(CodeMsg.PageNo);
        }
    }

    async selectPage({fields, whereSql, whereValues, orderSql, connection, page}) {
        let countSql = `select count(*) as total from ${this.table}`;
        let fieldSql = '*';
        if (fields && fields.length > 0) {
            fieldSql = fields.join(', ');
        }
        let sql = `select ${fieldSql} from ${this.table}`;
        if (whereSql) {
            countSql = `${countSql} where ${whereSql}`;
            sql = `${sql} where ${whereSql}`;
        }
        if (orderSql) {
            sql = `${sql} order by ${orderSql}`;
        }
        if (page.current < 1) {
            page.current = 1;
        }
        if (page.size < 1) {
            page.size = 10;
        }
        page.current = page.current - 1;
        page.from = page.current * page.size;
        page.to = page.from + page.size;
        sql = `${sql} limit ${page.from}, ${page.size}`;
        let promiseCount = this.query({sql: countSql, values: whereValues, connection});
        let promiseFind = this.query(({sql, values: whereValues, connection}));
        let result = await Promise.all([promiseCount, promiseFind]);
        let total = result[0][0].total;
        page.current = page.current + 1;
        page.total = total;
        page.max = Math.ceil(total / page.size);
        if (this.converField) {
            result[1].forEach(item => this.parse(item));
        }
        return result[1];
    }

    async insert(entity, {connection, extra} = {}) {
        let field = [];
        let place = [];
        let values = [];
        this.converField && this.stringify(entity);
        Object.keys(entity).forEach(key => {
            field.push(key);
            place.push('?');
            values.push(entity[key]);
        });
        let fieldSql = field.join(', ');
        let placeSql = place.join(', ');
        let sql = `insert into ${this.table} (${fieldSql}) values (${placeSql})`;
        let one = await this.query({sql, values, connection, extra});
        this.converField && this.parse(one);
        return one;
    }

    async update(entity, {whereSql, whereValues, connection, extra} = {}) {
        let set = [];
        let values = [];
        this.converField && this.stringify(entity);
        Object.keys(entity).forEach(key => {
            // 一般没有更新id的
            if (key !== 'id') {
                set.push(`${key} = ?`);
                values.push(entity[key]);
            }
        });
        let setSql = set.join(', ');
        let sql = `update ${this.table} set ${setSql}`;
        if (whereSql) {
            sql = `${sql} where ${whereSql}`;
            if (whereValues instanceof Array) {
                values.push(...whereValues);
            }
        }
        let one = await this.query({sql, values, connection, extra});
        this.converField && this.parse(one);
        return one;
    }

    async open() {
        return new Promise((resolve, reject) => {
            pool.getConnection(function (error, connection) {
                if (error) {
                    reject(error);
                } else {
                    resolve(connection);
                }
            });
        });
    }

    async beginTransaction(connection) {
        return new Promise((resolve, reject) => {
            connection.beginTransaction(function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve(error);
                }
            });
        });
    }

    async rollback(connection) {
        return new Promise((resolve, reject) => {
            connection.rollback(resolve);
        });
    }

    async commit(connection) {
        return new Promise((resolve, reject) => {
            connection.commit(function (error) {
                if (error) {
                    reject(error);
                } else {
                    resolve();
                }
            });
        });
    }
}

MySql.inPlaceSql = function (array) {
    // [1, 2, 3] => ?, ?, ?
    return new Array(array.length).join('?, ') + '?';
};
MySql.concat = function (sqlA, op, sqlB) {
    if (sqlA) {
        return `${sqlA} ${op} ${sqlB}`;
    }
    return sqlB;
};

function where(entity, op, andOr) {
    let whereValues = [];
    let whereKeys = [];
    Object.keys(entity).forEach(key => {
        let val = entity[key];
        if (val !== undefined) {
            whereKeys.push(key);
            if (op === 'like') {
                whereValues.push('%' + entity[key] + '%');
            } else {
                whereValues.push(entity[key]);
            }
        }
    });
    let whereSql = '';
    if (whereValues.length > 0) {
        whereSql = `(${whereKeys.join(` ${op} ? ${andOr} `)} ${op} ?)`;
    }
    return {
        whereSql,
        whereValues,
    };
}

MySql.andWhere = function (entity, op = '=') {
    return where(entity, op, 'and')
};
MySql.orWhere = function (entity, op = '=') {
    return where(entity, op, 'or')
};

MySql.like = function(field, list, op = 'and') {
    let pitch = [];
    let values = [];
    list.forEach(item => {
        pitch.push(`${field} like ?`);
        values.push(`%${item}%`);
    });
    return {
        sql: pitch.join(` ${op} `),
        values
    };
};
module.exports = MySql;

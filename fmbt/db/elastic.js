const {Client} = require('@elastic/elasticsearch');
const CF = require('../cf');
const client = new Client(CF.es());
const os = require('os');
const isMac = os.platform().toLowerCase() === 'darwin';
console.log('isMac', isMac, 'mac不知道为啥，client不能复用');
class Elastic {
    // async _create(id, body) {
    //     let _client = client;
    //     if (isMac) {
    //         _client = new Client(CF.es());
    //     }
    //     let params = {
    //         id,
    //         refresh: true,
    //         index: this._getIndexName(),
    //         body
    //     };
    //     let rs = await client.index(params);
    //     if (isMac) {
    //         _client.close();
    //     }
    //     return rs;
    // }
    _getClient() {
        if (isMac) {
            client.close();
            return new Client(CF.es());
        }
        return client;
    }
    async _searchPage (query, page, opt) {
        if (page.current < 1) {
            page.current = 1;
        }
        if (page.size < 1) {
            page.size = 10;
        }
        let body = {
            query,
            ...opt,
            from: (page.current - 1) * page.size,
            size: page.size
        };

        let rs = await this._getClient().search({
            index: this._getIndexName(),
            body
        });
        let hits = rs.body.hits;
        page.total = hits.total.value;
        rs = hits.hits.map(item => {
            let _source = item._source;
            _source._id = item._id;
            _source._score = item._score;
            return _source;
        });
        return rs;
    }
    _create(id, body) {
        return this._getClient().index({
            id,
            index: this._getIndexName(),
            refresh: true,
            body
        });
    }
    _updateDoc(id, doc) {
        return this._getClient().update({
            id,
            index: this._getIndexName(),
            refresh: true,
            body: {
                doc
            }
        });
    }

    _updateScript(id, script) {
        return this._getClient().update({
            id,
            index: this._getIndexName(),
            refresh: true,
            body: {
                script
            }
        });
    }

    _delete(id) {
        return this._getClient().delete({
            id,
            index: this._getIndexName(),
            refresh: true
        });
        // let rs;
        // try {
        //     rs = await
        // } catch (e) {
        //     // 404也算错，蛋疼
        //     console.error(e)
        // }
        // return rs;
    }
    _getIndexName() {
        // 必须小写
        return this.constructor.name.toLowerCase();
    }

    _existsIndex() {
        return this._getClient().indices.exists({
            index: this._getIndexName()
        })
    }

    _putMappings(properties) {
        return this._getClient().indices.putMapping({
            index: this._getIndexName(),
            body: {
                properties
            }
        });
    }

    _createIndex(properties, settings) {
        return this._getClient().indices.create({
            index: this._getIndexName(),
            body: {
                settings,
                mappings: {
                    properties
                }
            }
        });
    }
}

module.exports = Elastic;

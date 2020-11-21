const Elastic = require('../fmbt/db/elastic');

const Mappings = {
    properties: {
        // es本身会生成_id的映射
        // _id: {
        //     type: 'keyword'
        // },
        userId: {
            type: 'keyword'
        },
        folderId: {
            type: 'keyword'
        },
        name: {
            type: 'text',
            analyzer: 'ik_smart'
        },
        summary: {
            type: 'text',
            analyzer: 'ik_max_word'
        },
        preview: {
            type: 'text',
            index: false
        },
        firstImg: {
            type: 'text',
            index: false
        },
        inUse: {
            type: 'boolean'
        },
        private: {
            type: 'boolean'
        },
        md: {
            type: 'text',
            analyzer: 'ik_max_word'
        },
        time: {
            properties: {
                create: {
                    type: 'date'
                },
                update: {
                    type: 'date'
                }
            }
        },
        statics: {
            properties: {
                pv: {
                    type: 'integer'
                },
                great: {
                    type: 'integer'
                }
            }
        }
    }
}

class Note extends Elastic {
    createIndex() {
        return this._createIndex(Mappings.properties);
    }

    putMappings() {
        return this._putMappings(Mappings.properties);
    }

    searchPage({key, userId, _public, _source, folderIds}, page) {
        let must = [
            {
                match: {
                    inUse: true
                }
            }
        ];
        if (userId) {
            must.push({
                match: {
                    userId
                }
            });
        }
        if (_public) {
            must.push({
                match: {
                    private: false
                }
            })
        }
        if (folderIds) {
            must.push({
                terms: {
                    folderId: folderIds
                }
            })
        }
        // console.log(JSON.stringify(must), _source)
        return this._searchPage({
            bool: {
                must,
                should: [
                    {
                        match: {
                            name: {
                                // name中出现权重大
                                query: key,
                                boost: 2
                            }
                        }
                    },
                    {
                        match: {
                            md: {
                                query: key,
                                boost: 1
                            }
                        }
                    }
                ],
                minimum_should_match: 1 // 否则should可以都不满足
            }
        }, page, {_source})
    }
}

module.exports = new Note();

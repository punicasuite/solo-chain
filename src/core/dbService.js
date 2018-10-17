// import path, { resolve } from 'path'
import electron from 'electron'
const app = electron.remote.app;
const userData = app.getAppPath()
console.log('appPath: ' + userData)
if (!localStorage.getItem('savePath')) {
    localStorage.setItem('savePath', userData)
}
//create db
var Datastore = require('nedb');

const savePath = __static + '/db'


const blockDB = new Datastore({ filename: savePath + '/block.db', autoload: true });

const eventDB = new Datastore({ filename: savePath + '/event.db', autoload: true});

const txDB = new Datastore({ filename: savePath + '/transaction.db', autoload: true });

const scDB = new Datastore({ filename: savePath + '/smartcontract.db', autoload: true });


//indexing
blockDB.ensureIndex({ fieldName: 'hash', unique: true }, function (err) {
    console.log(err)
});

eventDB.ensureIndex({ fieldName: 'hash', unique: true }, function (err) {
    console.log(err)
});

txDB.ensureIndex({ fieldName: 'hash', unique: true }, function (err) {
    console.log(err)
});

scDB.ensureIndex({ fieldName: 'txhash', unique: true }, function (err) {
    console.log(err)
});

blockDB.loadDatabase();
eventDB.loadDatabase();
txDB.loadDatabase();
scDB.loadDatabase();

const pageSize = 10;
const dbFind = (db, opt, page) => {
    return new Promise((resolve, reject) => {
        if(page) {
            db.find(opt).sort({height:-1}).skip(pageSize * (page - 1)).limit(pageSize).exec((err, docs) =>{
                if(err) {
                    reject(err)
                } else {
                    resolve(docs)
                }
            })
        } else {
            db.find(opt, function (err, docs) {
                if (err) {
                    reject(err)
                } else {
                    resolve(docs)
                }
            })
        }
        
    })
}

const dbFindPage = (db, page) => {
    return new Promise((resolve, reject) => {
        db.find()
    })
}

const dbInsert = (db, doc) => {
    return new Promise((resolve, reject) => {
        db.insert(doc, function (err, newDoc) {
            if (err) {
                reject(err)
            } else {
                resolve(newDoc)
            }
        })
    })
}

const dbUpsert = (db, index, doc) => {
    return new Promise((resolve, reject) => {
        db.update({ [index]: doc.indexKey }, doc, { upsert: true }, function (err, numReplaced, upsert) {
            if (err) {
                reject(err)
            } else {
                resolve(upsert)
            }
        })
    })
}

export { 
    blockDB,
    eventDB,
    txDB,
    scDB,
    dbFind, 
    dbInsert, 
    dbUpsert 
};
// mongodb module import
const MongoClient = require('mongodb').MongoClient

// insert documents
const insertDocuments =  function(dbase,collectionString, data) {
    // Get the documents in a specific collection, insert specific data
    const db = client.db(dbase)
    const collection = db.collection(collectionString);
    collection.insertMany(data, function(err, result) {
        if (err) throw err
        console.log(result);
        // callback(result);
    });
}

// query dbs
const findDocuments = function(client, dbase, callback, collectionString, query) {
    // Get the documents collection
    const db = client.db(dbase)
    const collection = db.collection(collectionString);
    // Find some documents
    collection.find(query).toArray(function(err, docs) {
        if (err) throw err
        console.log("Found the following records");
        console.log(docs);
        callback(docs);
    });
}

// remove documents
const removeDocuments = function(dbase, collectionString, query) {
    const db = client.db(dbase)
    const collection = db.collection(collectionString);
    // Delete document where a is 3
    collection.deleteMany(query, function(err, result) {
        if (err) throw err;
        console.log("deleting entries from " + collectionString)
        // callback(result);
    });
}

const blankCallback = () => {
    return
}

// export
exports.insertDocuments = insertDocuments;
exports.findDocuments = findDocuments;
exports.removeDocuments = removeDocuments;
exports.blankCallback = blankCallback;
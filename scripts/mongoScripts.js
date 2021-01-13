// mongodb module import
const MongoClient = require('mongodb').MongoClient

const insertDocuments = function(db, collectionName, insertArray, callback) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Insert some documents
    collection.insertMany(insertArray, function(err, result) {
        if (err) throw err;
        callback(result);
    });
  }

const findDocuments = function(db, query, collectionName, callback) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Find some documents
    collection.find(query).toArray(function(err, docs) {
        if (err) throw err;
        // parseDocs = JSON.parse(docs)
        // console.log('returned docs: ' + docs);
        callback(docs);
        // return docs
    });
  }

const removeDocuments = function(db, collectionName, callback ) {
    // Get the documents collection
    const collection = db.collection(collectionName);
    // Delete document where a is 3
    collection.deleteMany( function(err, result) {
        if (err) throw err;
        callback(result);
    });
}

const dBInsert = function(uniqueArray, collectionName, callback) {
    if (uniqueArray.length > 0) {
        console.log(`You have ${uniqueArray.length} new records!`)
        collectionName.insertMany(uniqueArray, function(err, result) {
            if (err) throw err;
            console.log(result)
            // callback(result);
            callback()
        });
    } else {
        console.log('You have no new records')
    }
}

// export
exports.insertDocuments = insertDocuments;
exports.findDocuments = findDocuments;
exports.removeDocument = removeDocuments;
exports.dBInsert = dBInsert;
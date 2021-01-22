const dBInsert = function(uniqueArray, collectionName, client, callback) {
    if (uniqueArray.length > 0) {
        console.log(`You have ${uniqueArray.length} new records!`)
        collectionName.insertMany(uniqueArray, function(err, result) {
            if (err) throw err;
            // console.log(result.length + "records inserted")
            // callback(result);
            // callback()
            client.close()
        });
    } else {
        console.log(`You have no new records`)
        client.close()
    }
}

exports.dBInsert = dBInsert;
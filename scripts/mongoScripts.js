const dBInsert = function(insertArray, collectionName, client, callback) {
    if (insertArray.length > 0) {
        console.log(`You have ${insertArray.length} new records!`)
        collectionName.insertMany(insertArray, function(err, result) {
            if (err) throw err;
            client.close()
        });
    } else {
        console.log(`You have no new records`)
        client.close()
    }
}

exports.dBInsert = dBInsert;
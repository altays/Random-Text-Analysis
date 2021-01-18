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

exports.dBInsert = dBInsert;
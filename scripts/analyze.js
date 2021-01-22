const fs = require('fs');
const MongoClient = require('mongodb');
const helpFunc = require('./helperFunctions');
const mongoScripts = require('./mongoScripts')

// Connection URL, db name
const url = 'mongodb://localhost:27017';
const dbName = 'randomText';
const rawColWords = 'rawWords'
const rawColPatterns = 'rawPatterns'

// reading test file
fs.readFile('./testText.txt', 'utf8', async function(err, contents) {
    console.log("Opening text file")
    try {
        let documentNLP = helpFunc.nlpGeneral(contents).out('json')
        let sentences = helpFunc.nlpSentences(contents).out('tags');    

        let wordArray = await helpFunc.wordParse(documentNLP)
        let sentenceArray = await helpFunc.sentenceParse(sentences)

        // consider converting both mongo connect operations into one

        // Processing words
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
            console.log("Connected successfully to word collection");
            const db = client.db(dbName);
            const collection = db.collection(rawColWords);

            collection.find({}).toArray(function (err, docs) {
                if (err) throw err;
                let dbWords = helpFunc.parseDbData(docs);
                let uniqueWords = helpFunc.compareArrays(dbWords, wordArray);
                mongoScripts.dBInsert(uniqueWords, collection, client, () => {
                });
            });            
        });

        // Processing sentences
        MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
            console.log("Connected successfully to sentence collection");
            const db = client.db(dbName);
            const collection = db.collection(rawColPatterns);

            collection.find({}).toArray(function (err, docs) {
                if (err) throw err;
                let dbPatterns = helpFunc.parseDbData(docs);
                let uniquePatterns = helpFunc.compareArrays(dbPatterns, sentenceArray);
                mongoScripts.dBInsert(uniquePatterns, collection, client, () => {
                });
               
            });
        });

    }
    catch {
        console.log(err)
        client.close()
    }
});
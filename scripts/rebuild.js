const fs = require('fs');
const MongoClient = require('mongodb');
const helpFunc = require('./helperFunctions');
const mongoScripts = require('./mongoScripts')

// Connection URL, db name
const url = 'mongodb://localhost:27017';
const dbName = 'randomText';
const rawColWords = 'rawWords'
const rawColPatterns = 'rawPatterns'



// for each item in pattern, search db for words that match the tags, save the array in a variable,  and pick a random one from that array
    // add word to a string
        // write string

// Use connect method to connect to the server
MongoClient.connect(url,  { useUnifiedTopology: true }, async function(err, client) {
    try {
        let saveString = ""
        
        let sampleNum = 10

        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collectionPattern = db.collection(rawColPatterns);
        const collectionWord = db.collection(rawColWords)
        const pipeline = [{ $sample: { size: sampleNum} }]

        const aggCursor = collectionPattern.aggregate(pipeline)
        let patternArray = []

        await aggCursor.forEach(pattern => {
            patternArray.push(JSON.parse(pattern.pattern))
        })

        const parseDBPatterns = async () => {
            let saveArray = []
            // let randomTagIndex = helpFunc.getRandomInt(0, )

            for (let sentenceIndex = 0; sentenceIndex < patternArray.length; sentenceIndex++){
                let sentence = patternArray[sentenceIndex]
                for (let wordIndex = 0; wordIndex < sentence.length; wordIndex++ ) {
                    let tagArray = sentence[wordIndex]
                    if (tagArray.length > 1) {
                        let randomTag = helpFunc.getRandomInt(0,tagArray.length);
                        saveArray.push(tagArray[randomTag])
                    } else {
                        saveArray.push(tagArray[0])
                    }
                }
            }
            return saveArray;
        }

        let tagArray = await parseDBPatterns()

        await console.log(tagArray)

        client.close();
    }
    catch {
        console.error(err)
        client.close()
    }
});

// fs.writeFile('./message.txt', saveString, (err) => {
//     if (err) throw err;
//     console.log('The chopped up file has been saved!');
// });



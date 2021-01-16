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

        const pipelinePattern = [{ $sample: { size: sampleNum} }]
        const aggCursorPatterns = collectionPattern.aggregate(pipelinePattern)
        // const findCursorWords = collectionWord.find({ "tags": { $in: ["Noun"] } })
        
        let patternArray = []
        await aggCursorPatterns.forEach(pattern => {
            patternArray.push(JSON.parse(pattern.pattern))
        })

        const parseDBPatterns = async (array) => {
            let saveArray = []

            for (let sentenceIndex = 0; sentenceIndex < patternArray.length; sentenceIndex++){
                let sentence = array[sentenceIndex]
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

        let tagArray = await parseDBPatterns(patternArray)
        let tagSet = [...new Set(tagArray)]

        // let  tempObj = {}

        // let dbWords = {}
        dbWords = await tagSearch(tagSet)

        // await console.log(dbWords)

        // searching database for random words that contain each tag (see the aggregate model for the initial search - just use find ,though)
            // set search equal to a function, await it
            // this query searches for words that contain the single tag - db.getCollection('rawWords').find({ tags: { $in: ["Noun"] } })
            // shuffle all values, then pull 50?
                // use the algorithm here for shuffling https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array

            // converting tag array into an object with multiple "tag" : ["word", "word", ...] pairs, each tag being a key and array of words a val ue

        // rebuild sentences
            // loop over sentence pattern
            // if pattern index is an array, pull a random tag. otherwise, just use the tag
                // pull a random word from the tag / word object, add to string
                // at end of string, add a newline
        
        // await console.log(tagArray)

      
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



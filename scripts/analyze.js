const fs = require('fs');
const MongoClient = require('mongodb');
const helpFunc = require('./helperFunctions');
// const mongoScripts = require('./mongoScripts')

let wordObjArray = []
let sentenceObjArray = []
// let dbWords;
let cleanObjArray = []
let cleanSentenceArray = []

// reading test file
fs.readFile('./testText.txt', 'utf8', async function(err, contents) {
    try {
        // if (err) throw error
        console.log("Opening text file")

        let documentNLP = helpFunc.nlpGeneral(contents)
        let docTags = documentNLP.out('json')

        let sentences = helpFunc.nlpSentences(contents);    
        let sentencesTags = sentences.out('tags');
        let sentenceNum = sentencesTags.length

        let allWords = []
        let allTags = []

        // pulling out only words, contractions
        const reg = /(\w+\'\w+)|(\w+)/gi
        const commaReg = /[\,]/g

        // pulling all words and tags, processing, creating objects, and inserting objects into a larger array for insertion into db
         for (let i = 0; i < docTags.length; i++) {
            for (let j = 0; j < docTags[i].terms.length; j++) {
                let word = docTags[i].terms[j].text.toString().toLowerCase().trim()
                let tags = docTags[i].terms[j].tags
                let tagString = ""
            
                for (let tagIndex = 0; tagIndex < tags.length; tagIndex++) {
                    tags[tagIndex] = "#"+tags[tagIndex]
                    tagString += tags[tagIndex] + " "
                }

                // creating temporary array of words to keep track of currently captured words
                // if word contains a comma, replace comma with an apostrophe
                // create an array of objects, insert into collection
                if (reg.test(word)) {
                    if (allWords.toString().includes(word) != true) {
                        regWord = word.match(reg).toString()
  
                        if (regWord.search(commaReg) != -1) {
                            regWord = regWord.replace(",", "'")
                            // console.log(regWord)
                        }

                        allWords.push(regWord)
                        allTags.push(tagString.trim())
                        // helpFunc.aggreObjects(regWord,tagString.trimEnd(), wordObjArray)
                        wordObj = {}
                        wordObj["word"] = regWord
                        wordObj["tags"] = tagString.trim()
                        wordObjArray.push(wordObj)
                    }  
                }
            }
        }
        for (let index = 0; index < sentenceNum; index++) {            
            let posNLP = Object.values(sentencesTags[index]); 
            helpFunc.aggreObjects("pattern", JSON.stringify(posNLP), sentenceObjArray)
        }
        console.log("done reading file")
    }
    catch {
        console.log(err)
    }
});

// Connection URL, db name
const url = 'mongodb://localhost:27017';
const dbName = 'randomText';
const rawColWords = 'rawWords'
const rawColPatterns = 'rawPatterns'
const cleanColWords = 'cleanWords'
const cleanColPatterns = 'cleanPatterns' 


// MongoClient.connect(url,  { useUnifiedTopology: true }, async function(err, client) {
//     const db = client.db(dbName);
//     db.collection(rawColWords).find({}).toArray( async function(err, docs) {
//         try {
//             await console.log("Found the following records");
//             // await console.log(docs);
//             dbWords = docs
        
//             client.close(function() {
//                 console.log("close connection")
//             })
//         } catch {
//             console.log(err)
//         }
//     });
// });

MongoClient.connect(url,  { useUnifiedTopology: true }, async function(err, client) {
    const db = client.db(dbName);
    results = db.collection(rawColWords).find({}).toArray( async function(err, docs) {
        try {
            const dbWordsToArray = async() => {
                let dbWordList = ""
                for (let index = 0; index < docs.length; index++) {
                    const doc = docs[index].word
                    dbWordList += doc + " ";
                }
                return dbWordList.split(" ")
            }
           
            let dbWords = await dbWordsToArray()

            const compareDbToRaw = async() => {
                // use a loop
                // using findIndex()
            }
            // make another async function to compare the returned words?
            // 


            await console.log(dbWords)
            await client.close(function() {
                console.log("close connection")
            })
        } catch {
            console.log(err)
        }
    });
});


// MongoClient.connect(url,  { useUnifiedTopology: true }, async function(err, client) {
//     console.log("Connected successfully to raw word collection");
//     const db = client.db(dbName);
//     try {
//         db.collection(rawColWords).insertMany(wordObjArray)
//         .then( async function(result,err) {
//             console.log(result)
//             client.close(function() {
//                 console.log("close connection")
//             })
//         })
//     }
//     catch {
//         console.error(err)
//     }
// });

// MongoClient.connect(url,  { useUnifiedTopology: true }, async function(err, client) {
//     console.log("Connected successfully to raw pattern collection");
//     const db = client.db(dbName);
//     try {
//         db.collection(rawColPatterns).insertMany(sentenceObjArray)
//         .then( async function(result,err) {
//             console.log(result)
//             client.close(function() {
//                 console.log("close connection")
//             })
//         })
//     }
//     catch {
//         console.error(err)
//     }
// });

// MongoClient.connect(url,  { useUnifiedTopology: true }, async function(err, client) {
//     const db = client.db(dbName);
//     db.collection(rawColWords).find({}).toArray( async function(err, docs) {
//         try {
//             await console.log("Found the following records");
//             await console.log(docs);
        
//             client.close(function() {
//                 console.log("close connection")
//             })
//         } catch {
//             console.log(err)
//         }
//     });
// });

// use this query
    // db.getCollection('rawWords').find({word:{'$exists': true}}).count()
    // if count is greater than one, remove by the ID
// start with a call to database
    // put keys into an array
    // check pulled words against database array - if the pulled word is not in the database, insert it

// close database
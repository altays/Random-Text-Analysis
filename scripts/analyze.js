const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const helpFunc = require('./helperFunctions');
const mongoScripts = require('./mongoScripts')
 
// Connection URL, db name
const url = 'mongodb://localhost:27017';
const dbName = 'randomText';
const rawColWords = 'rawWords'
const rawColPatterns = 'rawPatterns'
const cleanColWords = 'cleanWords'
const cleanColPatterns = 'cleanPatterns'

// Use connect method to connect to the server
MongoClient.connect(url,  { useUnifiedTopology: true }, function(err, client) {
    //   assert.equal(null, err);
    console.log("Connected successfully to db");
    const db = client.db(dbName);
    // don't close db here in performance
    client.close();
});

// delete everything from the database


// reading test file
fs.readFile('./testText.txt', 'utf8', function(err, contents) {
    
    if (err) throw error
    console.log("Opening text file")

    let documentNLP = helpFunc.nlpGeneral(contents)
    let docTags = documentNLP.out('json')

    let sentences = helpFunc.nlpSentences(contents);    
    let sentencesTags = sentences.out('tags');
    let sentenceNum = sentencesTags.length

    let allWords = []
    let allTags = []
    let wordObjArray = []
    let sentenceObjArray = []

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
                        console.log(regWord)
                    }

                    allWords.push(regWord)
                    allTags.push(tagString.trim())
                    helpFunc.aggreObjects(regWord,tagString.trimEnd(), wordObjArray)
                }
            }
        }
    }
    // console.log(wordObjArray)
    for (let index = 0; index < sentenceNum; index++) {
        
        let posNLP = Object.values(sentencesTags[index]); 
        helpFunc.aggreObjects("pattern", JSON.stringify(posNLP), sentenceObjArray)

        // insert sentenceObjArray to raw pattern collection        
    }
    // for testing purposes, close database here
});



// cleaning database

    // query each word from raw collection
        // search for the word within the clean collection
            // if the word exists in clean collection, move to next word
            // if it doesn't exist in clean collection, add it to an array for inserting
        // insert array of new words into clean word collection

    // query each pattern from raw collection
        // search for the word within the clean collection
            // if the word exists in clean collection, move to next pattern
            // if it doesn't exist in clean collection, add it to an array for inserting
        // insert array of new patterns into clean word collection

    // remove all items from raw database

// close database
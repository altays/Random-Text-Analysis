const fs = require('fs');
const MongoClient = require('mongodb');
const helpFunc = require('./helperFunctions');
// const mongoScripts = require('./mongoScripts')

let sentenceObjArray = []
// let dbWords;
let cleanObjArray = []
let cleanSentenceArray = []
let newWordsArray = []

// Connection URL, db name
const url = 'mongodb://localhost:27017';
const dbName = 'randomText';
const rawColWords = 'rawWords'
const rawColPatterns = 'rawPatterns'
const cleanColWords = 'cleanWords'
const cleanColPatterns = 'cleanPatterns' 

// reading test file
fs.readFile('./testText.txt', 'utf8', async function(err, contents) {
    try {
        // if (err) throw error
        console.log("Opening text file")
        let documentNLP = helpFunc.nlpGeneral(contents)
        let docTags = documentNLP.out('json')
        let sentences = helpFunc.nlpSentences(contents);    
        let sentencesTags = sentences.out('tags');

        let wordArray = await helpFunc.wordParse(docTags)
        await console.log(wordArray)

        let sentenceArray = await helpFunc.sentenceParse(sentencesTags)
        await console.log(sentenceArray)
    }
    catch {
        console.log(err)
    }
});
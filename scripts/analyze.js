const fs = require('fs');
const MongoClient = require('mongodb');
const helpFunc = require('./helperFunctions');
// const mongoScripts = require('./mongoScripts')

let wordObjArray = []
let sentenceObjArray = []
// let dbWords;
let cleanObjArray = []
let cleanSentenceArray = []

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
        let newWordsArray = []
        MongoClient.connect(url,  { useUnifiedTopology: true }, async function(err, client) {
            const db = client.db(dbName);
           
            db.collection(rawColWords).find({}).toArray( async function(err, docs) {
                try {
                    const dbWordsToArray = async() => {
                        let dbWordList = []
                        for (let index = 0; index < docs.length; index++) {
                            const doc = docs[index].word
                            dbWordList.push(doc)
                        }
                        return dbWordList
                    }
                   
                    let dbWords = await dbWordsToArray()
                    
                    const compareDbToRaw = async() => {
                        let newArray = []
                        for (let rawIndex = 0; rawIndex < wordObjArray.length; rawIndex++){
                            index = dbWords.indexOf(wordObjArray[rawIndex].word)
                            if (index == -1) {
                                await newArray.push(wordObjArray[rawIndex])
                            }
                        }
                        return newArray
                    }
            
                    newWordsArray = await compareDbToRaw()
                    await console.log(`Length of first array: ${wordObjArray.length}`)
                    await console.log(`Length of db array: ${dbWords.length}`)
                    await console.log(`Length of new array: ${newWordsArray.length}`)
                    await client.close(function() {
                        console.log("close connection")
                    })
                } catch {
                    console.log(err)
                    await client.close(function() {
                        console.log("close connection")
                    })
                }
            });
        });
    }
    catch {
        console.log(err)
    }
});
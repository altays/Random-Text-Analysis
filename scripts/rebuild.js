const fs = require('fs');
const MongoClient = require('mongodb').MongoClient;
const helpFunc = require('./helperFunctions');
const mongoScripts = require('./mongoScripts')
 
// Connection URL
const url = 'mongodb://localhost:27017';
 
// Database Name
const dbName = 'randomText';

// Use connect method to connect to the server
MongoClient.connect(url,  { useUnifiedTopology: true }, function(err, client) {
    //   assert.equal(null, err);
    console.log("Connected successfully to server");
    const db = client.db(dbName);
    client.close();
});

// reading test file
fs.readFile('./testText.txt', 'utf8', function(err, contents) {
    
    if (err) throw error
    console.log("Opening text file")
    
    let testText = contents;

    let saveString = ""
    let wordString = ""
    let posArr = []

    let documentNLP = helpFunc.nlpGeneral(testText)
    let docTags = documentNLP.out('json')

    let sentences = helpFunc.nlpSentences(testText);    
    let sentencesTags = sentences.out('tags');

    let sentenceNum = sentencesTags.length
    let randIndex = helpFunc.getRandomInt(0,sentenceNum-1)
    let randLineNum = helpFunc.getRandomInt(randIndex,sentenceNum)

    let allWords = []
    let allTags = []
    // pulling out only words, contractions
    let reg = /(\w+\'\w+)|(\w+)/gi

     // pulling all words, tags fo rwords, and adding to array
    for (let i = 0; i < docTags.length; i++) {
        for (let j = 0; j < docTags[i].terms.length; j++) {
            let word = docTags[i].terms[j].text.toString().toLowerCase().trim()
            let tags = docTags[i].terms[j].tags
            let tagString = ""
          
            for (let tagIndex = 0; tagIndex < tags.length; tagIndex++) {
                tags[tagIndex] = "#"+tags[tagIndex]
                tagString += tags[tagIndex] + " "
            }

            if (reg.test(word)) {
                if (allWords.toString().includes(word) != true) {
                    regWord = word.match(reg)

                    // won't need this for inserting into the database
                    allWords.push(word.match(reg))
                    allTags.push(tagString.trim())
                    
                    wordString += `${regWord}: ${tagString}` + '\n'
                    let wordObj = {}
                    //create object, insert into database
                    wordObj[`${regWord}`] = `${tagString}`
                    // insert command here
                }
            }

        }
    }

    // modify
    for (let index = 0; index < sentenceNum; index++) {
        // let randomSentence = getRandomInt(0,sentencesTags.length-1) 
        
        let posNLP = Object.values(sentencesTags[index]); // set back to randomSentence for creating text docs
        let sentenceStructure = {}
        sentenceStructure = {"pattern":JSON.stringify(posNLP)}
        // console.log(sentenceStructure)

        // need to restructure this - random number of random sentence patterns, then analyze as follows
        for (let i = 0; i < posNLP.length; i++) {
         
            // if there is just one tag for the word
            if (posNLP[i].length === 1) {

                // query database for words that contain the tag, then randomly pick a word from that object
                let match = helpFunc.wordSearch(posNLP[i], allWords, allTags)
                let randomSelection = match[helpFunc.getRandomInt(0,match.length-1)]

                if (randomSelection != undefined) {
                    saveString+= randomSelection + " "
                }
            }

            // if there are multiple tags for the word, pick a random tag and search for words that match it
            else {
                let subArrayRandomTag = helpFunc.getRandomInt(0, posNLP[i].length)
                let subArrayStr = posNLP[i][subArrayRandomTag]
                
                let match = helpFunc.wordSearch(subArrayStr, allWords, allTags)
                let randomSelection = match[helpFunc.getRandomInt(0,match.length-1)]
                
                if (randomSelection != undefined) {
                    saveString+= randomSelection + " "
                }   
            }
        }
        saveString += "\n";
        posArr.push(posNLP)        
    }
    
    // fs.writeFile('./words-tags.txt', wordString, (err) => {
    //     if (err) throw err;
    //     console.log('The words-tags file has been saved!');
    // });

    // fs.writeFile('./message.txt', saveString, (err) => {
    //     if (err) throw err;
    //     console.log('The chopped up file has been saved!');
    // });

    // fs.writeFile('./pos.txt', JSON.stringify(posArr), (err) => {
    //     if (err) throw err;
    //     console.log('The parts of speech file has been saved!');
    // });

});
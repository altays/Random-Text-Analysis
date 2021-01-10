const nlp = require('compromise');
nlp.extend(require('compromise-sentences'))
const fs = require('fs');
 
// consider converting into a module
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

let nlpGeneral = function(text) {
    let doc = nlp(text);
    return doc;
}

let nlpSentences = function(text) {
    let doc = nlp(text)
    let sentences = doc.sentences();
    return sentences
}

// search tag array for indexes that contain selected tag
let tagSearch = function(tags, tagArray) {
    let indexArray = []
    for (let index = 0; index < tagArray.length; index++) {
        if (tagArray[index].includes(tags)) {
            indexArray.push(index)
        }
    }
    return indexArray
}

// search words at indexes
let wordSearch = function(searchTag, wordArray, tagArray) {
    searchArray = []
    for (let tagIndex = 0; tagIndex < tagSearch(searchTag,tagArray).length; tagIndex++){
        newWord = wordArray[tagSearch(searchTag,tagArray)[tagIndex]]
        searchArray.push(newWord)
    }
    return searchArray
}

// reading test file
fs.readFile('./testText.txt', 'utf8', function(err, contents) {
    if (err) throw error
    console.log("Opening text file")
    
    let testText = contents;

    let saveString = ""
    let wordString = ""
    let posArr = []

    let documentNLP = nlpGeneral(testText)
    let docTags = documentNLP.out('json')

    let sentences = nlpSentences(testText);    
    let sentencesTags = sentences.out('tags');

    let sentenceNum = sentencesTags.length
    let randIndex = getRandomInt(0,sentenceNum-1)
    let randLineNum = getRandomInt(randIndex,sentenceNum)

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
                    // console.log(wordObj)
                }
            }

        }
    }

    for (let index = 0; index < sentenceNum; index++) {
        // let randomSentence = getRandomInt(0,sentencesTags.length-1) 
        
        let posNLP = Object.values(sentencesTags[index]); // set back to randomSentence for creating text docs
        let sentenceStructure = {}
        sentenceStructure = {"pattern":JSON.stringify(posNLP)}
        console.log(sentenceStructure)

        // need to restructure this - random number of random sentence patterns, then analyze as follows
        for (let i = 0; i < posNLP.length; i++) {
         
            // if there is just one tag for the word
            if (posNLP[i].length === 1) {

                // query database for words that contain the tag, then randomly pick a word from that object
                let match = wordSearch(posNLP[i], allWords, allTags)
                let randomSelection = match[getRandomInt(0,match.length-1)]

                if (randomSelection != undefined) {
                    saveString+= randomSelection + " "
                }
            }

            // if there are multiple tags for the word, pick a random tag and search for words that match it
            else {
                let subArrayRandomTag = getRandomInt(0, posNLP[i].length)
                let subArrayStr = posNLP[i][subArrayRandomTag]
                
                let match = wordSearch(subArrayStr, allWords, allTags)
                let randomSelection = match[getRandomInt(0,match.length-1)]
                
                if (randomSelection != undefined) {
                    saveString+= randomSelection + " "
                }   
            }
        }
        saveString += "\n";
        posArr.push(posNLP)        
    }
    
    // console.log(posArr)

    fs.writeFile('words-tags.txt', wordString, (err) => {
        if (err) throw err;
        console.log('The words-tags file has been saved!');
    });

    fs.writeFile('message.txt', saveString, (err) => {
        if (err) throw err;
        console.log('The chopped up file has been saved!');
    });

    fs.writeFile('pos.txt', JSON.stringify(posArr), (err) => {
        if (err) throw err;
        console.log('The parts of speech file has been saved!');
    });

});
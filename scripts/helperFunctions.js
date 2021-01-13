const nlp = require('compromise');
nlp.extend(require('compromise-sentences'))
  
const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

const nlpGeneral = text => {
    let doc = nlp(text);
    return doc;
}

const nlpSentences = text => {
    let doc = nlp(text)
    let sentences = doc.sentences();
    return sentences
}

// search tag array for indexes that contain selected tag
const tagSearch = (tags, tagArray) => {
    let indexArray = []
    for (let index = 0; index < tagArray.length; index++) {
        if (tagArray[index].includes(tags)) {
            indexArray.push(index)
        }
    }
    return indexArray
}

// search words at indexes
const wordSearch = (searchTag, wordArray, tagArray) => {
    searchArray = []
    for (let tagIndex = 0; tagIndex < tagSearch(searchTag,tagArray).length; tagIndex++){
        newWord = wordArray[tagSearch(searchTag,tagArray)[tagIndex]]
        searchArray.push(newWord)
    }
    return searchArray
}

// pulling all words and tags, processing, creating objects, and inserting objects into a larger array for insertion into db
const wordParse = (docTags) => {
    let wordObjArray = []
    let allWords = []
    let allTags = []

    // pulling out only words, contractions
    const reg = /(\w+\'\w+)|(\w+)/gi
    const commaReg = /[\,]/g

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
                    regWord = word.match(reg).toString()

                    if (regWord.search(commaReg) != -1) {
                        regWord = regWord.replace(",", "'")
                    }

                    allWords.push(regWord)
                    allTags.push(tagString.trim())
                    wordObj = {}
                    wordObj["word"] = regWord
                    wordObj["tags"] = tagString.trim()
                    wordObjArray.push(wordObj)
                }  
            }
        }
    }
    return wordObjArray
}

const sentenceParse =  (sentencesTags) => {
    let sentenceArray = []
    for (let index = 0; index < sentencesTags.length; index++) {            
        let posNLP = Object.values(sentencesTags[index]); 
        sentenceObj = {}
        sentenceObj["pattern"] = JSON.stringify(posNLP);
        sentenceArray.push(sentenceObj)
    }
    return sentenceArray
}

const parseDbData = (doc) => {
    let dbData = []
    for (let i = 0; i < doc.length; i++){
        // console.log(doc[i])
        // let tempObj = {}
        // tempObj["word"]=doc[i].word
        // tempObj["tags"]=doc[i].tags
        dbData.push(doc[i].word)
    }

    // console.log(dbData)
    return dbData
}

const compareArrays = (dbData, rawData) => {
    let uniqueArray = []
    for (let i = 0; i < rawData.length; i++) {
        // console.log(rawData[i].word)
        if (dbData.indexOf(rawData[i].word) == -1) {
            uniqueArray.push(rawData[i])
        }
    }
    return uniqueArray
}

exports.getRandomInt = getRandomInt;
exports.nlpGeneral = nlpGeneral;
exports.nlpSentences = nlpSentences;
exports.wordSearch = wordSearch;
exports.wordParse = wordParse;
exports.sentenceParse = sentenceParse;
exports.parseDbData = parseDbData;
exports.compareArrays = compareArrays;
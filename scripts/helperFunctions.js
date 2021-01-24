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

            if (reg.test(word)) {
                if (allWords.toString().includes(word) != true) {
                    regWord = word.match(reg).toString()

                    if (regWord.search(commaReg) != -1) {
                        regWord = regWord.replace(",", "'")
                    }

                    allWords.push(regWord)
                    allTags.push(tags)
                    wordObj = {}
                    wordObj["word"] = regWord
                    wordObj["tags"] = tags 
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
        sentenceObj["pattern"] = posNLP;
        sentenceArray.push(sentenceObj)
    }
    return sentenceArray
}

const parseDbData = (doc) => {
    let dbData = []
    for (let i = 0; i < doc.length; i++){
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

const comparePatternArrays = (dbData, rawData) => {
    let uniqueArray = []
    for (let i = 0; i < rawData.length; i++) {
        if (dbData.indexOf(rawData[i].pattern) == -1) {
            uniqueArray.push(rawData[i])
        }
    }
    return uniqueArray
}

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

// array shuffle function from https://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
const shuffle = array => {
    var currentIndex = array.length, temporaryValue, randomIndex;
  
    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
  
      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
  
      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  
    return array;
  }

exports.getRandomInt = getRandomInt;
exports.nlpGeneral = nlpGeneral;
exports.nlpSentences = nlpSentences;
exports.wordSearch = wordSearch;
exports.wordParse = wordParse;
exports.sentenceParse = sentenceParse;
exports.parseDbData = parseDbData;
exports.compareArrays = compareArrays;
exports.comparePatternArrays = comparePatternArrays;
exports.parseDBPatterns = parseDBPatterns;
exports.shuffle = shuffle;
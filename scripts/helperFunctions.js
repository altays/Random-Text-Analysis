const nlp = require('compromise');
nlp.extend(require('compromise-sentences'))

const getName = () => {
    return 'Jim';
};

const getName2 = () => {
    return 'James'
}
  
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

exports.getName = getName;
exports.getName2 = getName2;
exports.getRandomInt = getRandomInt;
exports.nlpGeneral = nlpGeneral;
exports.nlpSentences = nlpSentences;
exports.wordSearch = wordSearch;
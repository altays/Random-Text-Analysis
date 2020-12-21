const nlp = require('compromise');
nlp.extend(require('compromise-sentences'))

const fs = require('fs');
 
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
    //parse the text, again
    let doc = nlp(text)

    // pull out adjectives
    let sentences = doc.sentences();

    //print it again, as text
    return sentences
}

// search allTags array for a subarray that contains the tag
// using that index, pull that word from the allWords array
let tagSearch = function(tags, tagArray) {
    let indexArray = []
   
    for (let index = 0; index < tagArray.length; index++) {
        // console.log(allTags[index] + " " + allTags[index].includes('#Verb'))
        if (tagArray[index].includes(tags)) {
            indexArray.push(index)
        }
    }
    return indexArray
}

let wordSearch = function(searchTag, wordArray, tagArray) {
    searchArray = []
    for (let tagIndex = 0; tagIndex < tagSearch(searchTag,tagArray).length; tagIndex++){
        newWord = wordArray[tagSearch(searchTag,tagArray)[tagIndex]]
        searchArray.push(newWord)
    }
    return searchArray
}

// reading test file
fs.readFile('testText.txt', 'utf8', function(err, contents) {
    if (err) throw error
    let testText = contents;

    let saveString = ""

    let documentNLP = nlpGeneral(testText)
    let docTags = documentNLP.out('json')

    let sentences = nlpSentences(testText);    
    let sentencesTags = sentences.out('tags');
    let sentencesJSON = sentences.out('json')

    // get number of sentences
    // pick a random starting index
    // get difference between max and starting point
    // pick a random number of lines within that range

    let sentenceNum = sentencesTags.length
    let randIndex = getRandomInt(0,sentenceNum-1)
    let randLineNum = getRandomInt(randIndex,sentenceNum)

    let allWords = []
    let allTags = []

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

            if (allWords.includes(word) != true) {
                allWords.push(word)
                allTags.push(tagString.trim())
            }
        }
    }

    // console.log(wordSearch("#Verb", allWords, allTags)[0])
    // consider just pulling one tag from the pulled tag list - gives more options - includes() gives false if not in the right oder
    // iterate over array returned from wordSearch -> put the one tag in, then use randInt to pick the word

    for (let index = randIndex; index < randLineNum; index++) {   
        let posNLP = Object.values(sentencesTags[index]);
        // console.log(posNLP)

        for (let i = 0; i < posNLP.length; i++) {
            // if the value at the index is a string, or single value
            if (typeof posNLP[i] == "string") {

                // console.log(posNLP[i])
                let match = documentNLP.match(posNLP[i]).json()
                let randomSelection = match[getRandomInt(0,match.length-1)]

                if (randomSelection != undefined) {
                    saveString+= randomSelection.text + " "
                }
            }
            // if the value is an object, or has multiple values
            else {
                let subArrayStr = ""
                let subArrayLoopRandom = getRandomInt(0, posNLP[i].length)

                // pulling a random number of tags to vary specificity
                for (let j = 0; j < subArrayLoopRandom; j++){
                    subArrayStr += " " + posNLP[i][j]
                }
                //searching for all words that match tags, pulling a random word from that list
                let match = documentNLP.match(subArrayStr).json()
                let randomSelection = match[getRandomInt(0,match.length-1)]

                if (randomSelection != undefined) {
                    saveString+= randomSelection.text + " "
                }   
            }
        }
        saveString += "\n";
    }

    // fs.writeFile('message.txt', saveString, (err) => {
    //     if (err) throw err;
    //     console.log('The file has been saved!');
    // });
   
});







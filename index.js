const nlp = require('compromise');

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

// reading test file
fs.readFile('testText.txt', 'utf8', function(err, contents) {
    if (err) throw error
    let testText = contents;

    let saveString = ""

    let documentNLP = nlpGeneral(testText)
    let docTags = documentNLP.out('text')

    let sentences = nlpSentences(testText);    
    let sentencesTags = sentences.out('tags');

    // get number of sentences
    // pick a random starting index
    // get difference between max and starting point
    // pick a random number of lines within that range

    let sentenceNum = sentencesTags.length
    let randIndex = getRandomInt(0,sentenceNum-1)
    let randLineNum = getRandomInt(randIndex,sentenceNum)

    for (let index = randIndex; index < randLineNum; index++) {
       
        let posNLP = Object.values(sentencesTags[index]);

        // adding "#" to the beginning of each tag so they can be used in .match()
        for (let i = 0; i < posNLP.length; i++){
            if (posNLP[i].length === 1) {
                posNLP[i] = "#" + posNLP[i] 
            }
            else {
                for (let j = 0; j < posNLP[i].length; j++) {
                    posNLP[i][j] = "#" + posNLP[i][j] 
                }
            }
        }

        for (let i = 0; i < posNLP.length; i++) {
            // if the value at the index is a string, or single value
            if (typeof posNLP[i] == "string") {

                // find all words that match the term, pick one random one and concat
                let match = documentNLP.match(posNLP[i]).json()
                let randomSelection = match[getRandomInt(0,match.length-1)]

                if (randomSelection != undefined) {
                    saveString+= randomSelection.text + " "
                }
            }
            // if the value is an object, or has multiple values
            else {
                let subArrayStr = ""
                let subArrayLoopRandom = getRandomInt(0, posNLP[i].length-1)

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

    fs.writeFile('message.txt', saveString, (err) => {
        if (err) throw err;
        console.log('The file has been saved!');
    });
   
});







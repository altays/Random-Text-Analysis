const fs = require('fs');
const MongoClient = require('mongodb');
const helpFunc = require('./helperFunctions');

// Connection URL, db name
const url = 'mongodb://localhost:27017';
const dbName = 'randomText';
const rawColWords = 'rawWords'
const rawColPatterns = 'rawPatterns'

MongoClient.connect(url,  { useUnifiedTopology: true }, async function(err, client) {
    try {
        let queryArray = []    
        let sampleNum = 10

        console.log("Connected successfully to server");
        const db = client.db(dbName);
        const collectionPattern = db.collection(rawColPatterns);
        const collectionWord = db.collection(rawColWords)

        const pipelinePattern = [{ $sample: { size: sampleNum} }]
        const aggCursorPatterns = collectionPattern.aggregate(pipelinePattern)

        let patternArray = []
        await aggCursorPatterns.forEach(pattern => {
            patternArray.push(JSON.parse(pattern.pattern))
        })

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
            
            saveArray = [...new Set(saveArray)]

            for (let i = 0; i < saveArray.length; i++) {
                queryArray.push({tags:saveArray[i]})
            }
            return queryArray
        }

        let query = await parseDBPatterns(patternArray)
        const wordSearch = collectionWord.find({ $or: query})
        
        const docWords = wordSearch.toArray(function (err, docs) {
            if (err) throw err;

            let tempArrWords = []
            let tempArrTags = []
            let combinedString = ""
            
            docs.forEach(doc => {
                tempArrWords.push(doc.word)
                tempArrTags.push(doc.tags[helpFunc.getRandomInt(0,doc.tags.length)])
            })

            patternArray.forEach(pattern => {
                combinedString += "\n"
    
                pattern.forEach( subpattern => {
                    let randomWordSet = []
                    let randomTag = subpattern[helpFunc.getRandomInt(0,subpattern.length)] 
                    for (let i = 0; i < tempArrTags.length; i++) {
                        if (tempArrTags[i] == randomTag) {
                            randomWordSet.push(tempArrWords[i])
                        }
                    }
   
                    let randomWord = randomWordSet[helpFunc.getRandomInt(0, randomWordSet.length)]
                    if (randomWord != undefined) {
                        combinedString+= randomWord +" "
                    }
                        
                })
            })

            fs.writeFile('message.txt', combinedString.trim(), (err) => {
                if (err) throw err;
                console.log('The parts of speech file has been saved!');
            });

            client.close()
        })      
    }
    catch {
        console.error(err)
        client.close()
    }
});
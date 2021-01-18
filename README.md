# Random-Text-Analysis

This project utilizes [Compromise.js](http://compromise.cool/) to analyze a text document for sentence patterns and words. MongoDB is also utilized to store words (with tags) and sentence patterns.

To install, clone or fork the repo and install the modules using 'npm install'. To analyze text, add a text file with the name "testText.txt" to the scripts file and run "npm run analyze". To reconstruct a sentence using data from the database, first analyze any number of text documents, then run "npm run rebuild". The resulting text will be stored in "message.txt." 

***
## License

Copyright (c) 2020 Alex Taylor.
Released under MIT. See the LICENSE file for more details.
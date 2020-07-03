let express = require('express');
let app = express();
const cors = require('cors');
const port = 8091;
let bodyParser = require('body-parser');
let fs = require('fs');
app.use(cors());
app.use(bodyParser.json());

let dictionary = [];
let server = app.listen(port, function () {
    let port = server.address().port;
    console.log('NODE SERVER RUNNING on localhost:' + port);
});

app.post('/unscramble', function (req, res) {
    let scrambled = req.body.scrambled;
    unscramble(scrambled).then(data => {
        res.send(data)
    });
});

let unscramble = async (scrambled) => {
    await getDictionary();
    let permutations = findPermutations(scrambled);
    // console.log(permutations);
    let realWords = [];
    permutations.forEach(function (word) {
        if (realWords.indexOf(word) === -1) {
            let t = langCheck(word);
            if (t)
                realWords.push(word)
        }
    })
    return realWords;
};

let langCheck = (word) => {
    return dictionary.indexOf(word) !== -1;
};

let findPermutations = (string) => {
    if (!string || typeof string !== "string") {
        return "Please enter a string"
    } else if (string.length < 2) {
        return string
    }

    let permutationsArray = [];

    for (let i = 0; i < string.length; i++) {
        let char = string[i]
        let remainingChars = string.slice(0, i) + string.slice(i + 1, string.length)
        for (let permutation of findPermutations(remainingChars)) {
            permutationsArray.push(char + permutation)
        }
    }
    return permutationsArray
}

let getDictionary = async () => {
    dictionary = fs.readFileSync(__dirname + '/dictionary.txt').toString().split('\n');
}

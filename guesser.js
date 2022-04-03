
// Global variables.
correct_positions   = ['', '', '', '', ''];
incorrect_positions = [[], [], [], [], []];
contains_letters    = [];
currRow = 0
currCol = 0
suggestion = '';
tileStates = [
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1]
];

// This function is called whenever a tile is clicked. It attempts to toggle
// the current tile color if the row is currently editable.
function tileClick(id) {

    // Only allow if we are on the current row
    if(currRow == id.substring(0,1)) {

        tileStates[id.substring(0,1)][id.substring(1)] = (1 + tileStates[id.substring(0,1)][id.substring(1)]) % 3
        var newColor = tileStates[id.substring(0,1)][id.substring(1)];
        $(`#${id}`).removeClass("black grey yellow green");

        if(newColor == 0) {
            $(`#${id}`).addClass("grey");
        }
        else if(newColor == 1) {
            $(`#${id}`).addClass("yellow");
        }
        else {
            $(`#${id}`).addClass("green");
        }

    }

}

// Event handler for any user key press.
document.addEventListener("keydown", function(e) {
    key = e.key;

    // Handles typing of letters.
    if(key.charCodeAt(0) >= 97 && key.charCodeAt(0) <= 122) {

        if(currCol <= 4) {

            $(`#${currRow}${currCol}`).text(key.toUpperCase());
            $(`#${currRow}${currCol}`).addClass("type");
            $(`#${currRow}${currCol}`).addClass("hasLetter");
            currCol += 1;
            setTimeout(function() {
                $(`#${currRow}0`).removeClass("type");
                $(`#${currRow}1`).removeClass("type");
                $(`#${currRow}2`).removeClass("type");
                $(`#${currRow}3`).removeClass("type");
                $(`#${currRow}4`).removeClass("type");
            }, 50);

            // Need to remove suggestion when typing.
            if(currRow >= 1) {
                console.log('remove suggestion...');
                $(`#${currRow}${currCol - 1}`).removeClass("suggestion");
            }
        }

    }

    // Handles typing of backspace.
    if(key == 'Backspace') {

        if(currCol >= 1) {

            $(`#${currRow}${currCol - 1}`).removeClass("hasLetter");
            currCol -=1;
            $(`#${currRow}${currCol}`).text('');

            // Need to readd suggestion if backspacing.
            if(currRow >= 1) {
                $(`#${currRow}${currCol}`).addClass("suggestion");
                $(`#${currRow}${currCol}`).text(suggestion[currCol]);
            }
        }
    }

    // Handles typing of enter.
    if(key == 'Enter') {
        
        // If the entire word is entered and all tiles are colored.
        if(currRow <= 4 && currCol == 5 && tileStates[currRow].includes(-1) == false) {
            currCol = 0;
            currRow += 1;
            rotateTiles();
            processInput(currRow - 1);
        }

        // Otherwise, shake to show incompletion.
        else {
            $(`#${currRow}`).addClass("shake");
            setTimeout(function() {
                $(`#${currRow}`).removeClass("shake");
            }, 250);
        }

    }

});

// Rotates the tiles in sequence one after the other
function rotateTiles() {
    $(`#${currRow - 1}0`).addClass("rotate");
    setTimeout(() => {
        $(`#${currRow - 1}1`).addClass("rotate");
        setTimeout(() => {
            $(`#${currRow - 1}2`).addClass("rotate");
            setTimeout(() => {
                $(`#${currRow - 1}3`).addClass("rotate");
                setTimeout(() => {
                    $(`#${currRow - 1}4`).addClass("rotate");
                }, 275);
            }, 275);
        }, 275);
    }, 275);
}

// Uses the input from the submitted row to suggest the next word.
function processInput(currRow) {

    // Need to get the word and the color of the tiles.
    word = '';
    tiles = '';

    for(i = 0; i < 5; i++) {
        
        // Retrieve all letters of the guessed word.
        word += $(`#${currRow}${i}`).text();

        // Retrieve all colors of the tiles.
        if($(`#${currRow}${i}`).attr('class').split(/\s+/).includes("green")) {
            tiles += "2";
        }
        else if($(`#${currRow}${i}`).attr('class').split(/\s+/).includes("yellow")) {
            tiles += "1";
        }
        else if($(`#${currRow}${i}`).attr('class').split(/\s+/).includes("grey")) {
            tiles += "0";
        }
    }

    console.log(word, tiles);

    // Determine the best next word using this information.
    makeGuess(word, tiles, correct_positions, incorrect_positions, contains_letters);
    filterWords(words, correct_positions, incorrect_positions, contains_letters);
    
    // Print the entire list to the console.
    ranks = getRankings(words);
    console.log(ranks);

    // Store the suggestion for viewing in the next row.
    suggestion = ranks[0][0];

    // Display the next best word on the board.
    setTimeout(() => {
        $(`#${currRow + 1}${0}`).text(ranks[0][0][0]);
        $(`#${currRow + 1}${0}`).addClass("suggestion");
        setTimeout(() => {
            $(`#${currRow + 1}${1}`).text(ranks[0][0][1]);
            $(`#${currRow + 1}${1}`).addClass("suggestion");
            setTimeout(() => {
                $(`#${currRow + 1}${2}`).text(ranks[0][0][2]);
                $(`#${currRow + 1}${2}`).addClass("suggestion");
                setTimeout(() => {
                    $(`#${currRow + 1}${3}`).text(ranks[0][0][3]);
                    $(`#${currRow + 1}${3}`).addClass("suggestion");
                    setTimeout(() => {
                        $(`#${currRow + 1}${4}`).text(ranks[0][0][4]);
                        $(`#${currRow + 1}${4}`).addClass("suggestion");
                    }, 250);
                }, 250);
            }, 250);
        }, 250);
    }, 1750);
}

// Updates arrays based on the guess provided.
function makeGuess(guess, guess_outcome, correct_positions, incorrect_positions, contains_letters) {
    
    // Loop through each letter of the guess.
    grays = [];
    for(i = 0; i < guess.length; i++) {

        // If the letter is gray...
        if(guess_outcome[i] == 0) {

            // Mark it and check it after possible greens arise.
            grays.push(guess[i]);
    
        }

        // If the letter is yellow...
        else if(guess_outcome[i] == 1) {
            incorrect_positions[i].push(guess[i]);
            contains_letters.push(guess[i]);
        }

        // If the letter is green...
        else {
            correct_positions[i] = guess[i];
        }
            
    }

    // Need to consider the grays.
    for(i = 0; i < grays.length; i++) {

        // If a yellow tile of this letter exists, do nothing.
        if(contains_letters.includes(guess[i]))
            continue;

        // Only rule it out of other non-green positions.
        if(correct_positions[0] != grays[i])
            incorrect_positions[0].push(grays[i]);
        if(correct_positions[1] != grays[i])
            incorrect_positions[1].push(grays[i]);
        if(correct_positions[2] != grays[i])
            incorrect_positions[2].push(grays[i]);
        if(correct_positions[3] != grays[i])
            incorrect_positions[3].push(grays[i]);
        if(correct_positions[4] != grays[i])
            incorrect_positions[4].push(grays[i]);
    }
 
}

// Filters the list of words to only contain remaining possibilities.
function filterWords(words, correct_positions, incorrect_positions, contains_letters) {

    marked = [];
    for(i = 0; i < words.length; i++) {
        
        // If they are missing a required letter...
        if((correct_positions[0] != '' && words[i][0] != correct_positions[0]) || (correct_positions[1] != '' && words[i][1] != correct_positions[1]) || (correct_positions[2] != '' && words[i][2] != correct_positions[2]) || (correct_positions[3] != '' && words[i][3] != correct_positions[3]) || (correct_positions[4] != '' && words[i][4] != correct_positions[4])) {
            marked.push(words[i]);
        }

        // If they contain a letter in an incorrect position...
        if((incorrect_positions[0].includes(words[i][0])) || (incorrect_positions[1].includes(words[i][1])) || (incorrect_positions[2].includes(words[i][2])) || (incorrect_positions[3].includes(words[i][3])) || (incorrect_positions[4].includes(words[i][4]))) {
            marked.push(words[i]);
        }

        // If the word does not contain all of the correct letters...
        for(j = 0; j < contains_letters.length; j++) {
            if(words[i].includes(contains_letters[j]) == false) {
                marked.push(words[i]);
            }
        }
    }

    // Remove the marked words for deletion.
    for(i = 0; i < marked.length; i++) {
        if(words.includes(marked[i])) {
            toRemove = words.indexOf(marked[i]);
            words.splice(toRemove, 1);
        }
    }

}
    
// Return a list of 2-tuples containing sorted words and their ranks.
function getRankings(words) {

    // Find the most common letter / position combinations.
    mapping = [{}, {}, {}, {}, {}];
    for(i = 0; i < words.length; i++) {
        for(j = 0; j < 5; j++) {
            if((Object.keys(mapping[j])).includes(words[i][j]) == false) {
                mapping[j][words[i][j]] = 0;
            }
            mapping[j][words[i][j]] += 1;
        }
    }

    words_ranks = [];
    half = words.length / 2;
    for(i = 0; i < words.length; i++) {
        rank = 0;
        for(j = 0; j < 5; j++) {
            rank += Math.abs(half - mapping[j][words[i][j]])
        }
        words_ranks.push(rank)
    }

    // Generate a list of words and their ranks.
    sorted_ranks = [...words_ranks];
    result = [];
    for(i = 0; i < words.length; i++) {
        result.push([words[i], sorted_ranks[i]]);
    }

    // Sort the list of 2-tuples.
    result.sort((a,b) => a[1] -b[1]);
    
    // Return the list of 2-tuples.
    return result;

}
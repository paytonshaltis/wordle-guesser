// Delay between each tiles' rotation (ms).
ROTATION_DELAY = 275;

// Amount of time before pulse effect is removed from a tile (ms).
// Should match CSS variable --pulse-length.
PULSE_LENGTH = 50;

// The duration of a row's shake for an incomplete row entry (ms).
SHAKE_LENGTH = 250;

// The duration that error messages remain on the screen (ms).
ERROR_LENGTH = 1500;

// Delay between winning and displaying the ending modal (ms).
MODAL_DELAY = 1000;

// Delay between each tile showing its suggested letter (ms).
SUGGESTION_DELAY = 250;

// Time for a single tile to bounce when the puzzle is solved (ms).
TILE_BOUNCE_TIME = 100;

// Game board dimensions.
BOARD_ROWS = 6;
BOARD_COLUMNS = 5;

// The maximum number of suggested words shown per page of results.
MAX_SUGGESTED_WORDS = 100;

// Matrix storing the color states for each tile.
var tiles = '';
var tileStates = [
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1]
];

// The current suggested word based on previously entered words.
var suggestion = '';

// Keeps track of the current editable tile on the game board.
currRow = 0
currCol = 0

// Keeps track of which letters are in which positions.
correctPositions   = ['', '', '', '', ''];
incorrectPositions = [[], [], [], [], []];
containsLetters    = [];

// Indicates if an error message is currently being displayed.
errorShowing = false;

doneRunning = false;
typingEnabled = true;
clickingEnabled = true;

showingStats = false;
statsEnabled = false;
statsMode = null;
statsWord = null;

currentWordEntered = '';

messages = {
    'user_t' : 'You Got It!',
    'hit-bottom_t' : 'Uh Oh.',
    'no-find_t' : 'Check your Input.',
    'program-found_t' : 'We Got It!',
    'user' : 'Good job finding the correct word and solving the puzzle!',
    'hit-bottom' : 'Looks like you hit the bottom of the board before solving.',
    'no-find' : 'Looks like no words match your input. Check again to confirm your word / color combinations.',
    'program-found' : 'Based on your input, we were able to determine the word and solve the puzzle!',
    'common' : 'How did we do? Are you enjoying the site?'
}

// Attempts to toggle a clicked tile based on if clicking is enabled and if the
// tile falls within the current editable row. This function is called from the
// 'onclick' attribute on the tile HTML elements themselves.
function toggleTile(tileID) {

    // Extract the row and column from the coordinate string.
    row = tileID.substring(0, 1);
    col = tileID.substring(1);

    // Toggling is only allowed for the current row and when clicking is enabled.
    if(currRow == row && clickingEnabled) {

        // Toggle the tile state using modulo arithmetic.
        tileStates[row][col] = (1 + tileStates[row][col]) % 3
        var newColor = tileStates[row][col];

        // Assign the proper CSS class based on tileStates status.
        $(`#${tileID}`).removeClass("black grey yellow green");
        if(newColor == 0) {
            $(`#${tileID}`).addClass("grey");
        }
        else if(newColor == 1) {
            $(`#${tileID}`).addClass("yellow");
        }
        else {
            $(`#${tileID}`).addClass("green");
        }

    }

}

// Callback function for handling keydown events within the page.
function handleKeydown(e) {
    
    // Store the string representation of the key pressed.
    key = e.key;

    // Handles typing of lowercase letters.
    if(key.charCodeAt(0) >= 97 && key.charCodeAt(0) <= 122 && typingEnabled) {

        // Call the function for adding a letter.
        addLetter(key.toUpperCase());

    }

    // Handles typing of backspace.
    if(key == 'Backspace' && typingEnabled) {

        // Remove the last letter from the current row.
        removeLetter();

    }

    // Handles typing of enter.
    if(key == 'Enter' && typingEnabled) {
        
        // Determine if the word to be processed meets the criteria.
        var fullWord    = currCol == BOARD_COLUMNS;
        var allColored  = !tileStates[currRow].includes(-1);
        var isValidWord = ALL_WORDS.includes(($(`#${currRow}${0}`).text() + $(`#${currRow}${1}`).text() + $(`#${currRow}${2}`).text() + $(`#${currRow}${3}`).text() + $(`#${currRow}${4}`).text()));

        // Only accept words meeting all of the criteria.
        if(fullWord && allColored && isValidWord) {

            // Disable typing and clicking of tiles and increase the current row.
            typingEnabled = false;
            clickingEnabled = false;

            // Complete the puzzle with 'hit-bottom' if the last row is not all green.
            if(currRow == (BOARD_ROWS - 1) && getRowColorsString(row) != '22222') {
                rotateTiles(currRow);
                setTimeout(() => {
                    completed(currentWordEntered, 'hit-bottom');
                }, MODAL_DELAY);
                return;
            }

            // Process input and rotate tiles for the current row of input.
            processInput(currRow);
            rotateTiles(currRow);

            // Move down to the next row and clear the current word for further input.
            currentWordEntered = '';
            currRow += 1;
            currCol = 0;
        }

        // Otherwise, show the error message for incomplete input.
        else {
            displayError();
        }
    }

    // Handles typing of escape.
    if(key == 'Escape' && statsEnabled) {
        toggleStatsMenu();
    }

}

// Event handler for any user key press.
document.addEventListener("keydown", handleKeydown);

// Add a letter to the next available board tile.
function addLetter(letter) {

    // User can only enter 5 characters per row.
    if(currCol < BOARD_COLUMNS) {

        // Add the character to the currentWordEntered string.
        currentWordEntered += letter;

        // Add the character to the current (row, col) tile, adding
        // pulse effect ('type' class) and border ('has-letter' class).
        $(`#${currRow}${currCol}`).text(letter);
        $(`#${currRow}${currCol}`).addClass("type");
        $(`#${currRow}${currCol}`).addClass("has-letter");

        // Allow time to show pulse animation before setting timeout
        // to remove the pulse effect ('type' class).
        
        // Use the current row and column to determine which tile to remove the 
        // 'type' class from. Row and column must be saved into different variables
        // since both of them may change before the timeout function is invoked.
        var storedRow = currRow;
        var storedCol = currCol;
        setTimeout(function() {
            $(`#${storedRow}${storedCol}`).removeClass("type");
        }, PULSE_LENGTH);

        // Should overwrite the suggested letter in the current tile, if any.
        if(currRow > 0) {
            $(`#${currRow}${currCol}`).removeClass("suggestion");
        }

        // Increment the current editable column by 1.
        currCol += 1;
    }
}

// Remove the last letter from the current row.
function removeLetter() {

    // User can only go as far back as the first column.
    if(currCol > 0) {

        // Remove the last character from the currentWordEntered string.
        currentWordEntered = currentWordEntered.substring(0, currentWordEntered.length - 1);

        // Move our current column back to the last typed letter.
        currCol -=1;

        // Remove the border from the tile ('has-letter' class) and 
        // delete the text content (the letter) from the current tile.
        $(`#${currRow}${currCol}`).removeClass("has-letter");
        $(`#${currRow}${currCol}`).text('');

        // Should add the 'suggestion' class back to this tile and 
        // redisplay any hidden suggestions when text was initially typed.
        if(currRow > 0) {
            $(`#${currRow}${currCol}`).addClass("suggestion");
            $(`#${currRow}${currCol}`).text(suggestion[currCol]);
        }
    }

}

// Rotates all tiles for a given row in sequence from left to right.
function rotateTiles(row) {

    // Add and remove the 'rotate' class after ROTATION_DELAY.
    $(`#${row}0`).addClass("rotate");
    setTimeout(() => {
        $(`#${row}1`).addClass("rotate");
    }, 1 * ROTATION_DELAY);
    setTimeout(() => {
        $(`#${row}2`).addClass("rotate");
    }, 2 * ROTATION_DELAY);
    setTimeout(() => {
        $(`#${row}3`).addClass("rotate");
    }, 3 * ROTATION_DELAY);
    setTimeout(() => {
        $(`#${row}4`).addClass("rotate");
    }, 4 * ROTATION_DELAY);

}

// Shakes the tiles in a single row.
function shakeRow(row) {

    // Apply the 'shake' class to the current row.
    $(`#${row}`).addClass("shake");

    // Remove the 'shake' class from the current row after the shake length.
    setTimeout(function() {
        $(`#${row}`).removeClass("shake");
    }, SHAKE_LENGTH);

}

// Display a message indicating an incomplete row entry.
function displayError() {

    // Shake the tiles in the current row.
    shakeRow(currRow);

    // Display the error message on the screen.
    $(`div.error`).addClass("show");

    // As long as an error message is not displaying, remove 
    // the error message after ERROR_LENGTH milliseconds.
    if(!errorShowing) {
        errorShowing = true;
        setTimeout(() => {
            $(`div.error`).removeClass("show");
            errorShowing = false;
        }, ERROR_LENGTH);
    }

    // Determine the cause of error.
    var missingLetters = currCol != BOARD_COLUMNS;
    var invalidWord = !ALL_WORDS.includes(currentWordEntered);

    // If the user is missing letters...
    if(missingLetters) {
        $(`div.error`).text("Missing Letters");
    }

    // If the word is invalid...
    else if(invalidWord) {
        $(`div.error`).text("Invalid Word");
    }

    // If the user is missing colors...
    else {
        $(`div.error`).text("Missing Colors");
    }

}

// Get an encoded string of tile colors for the desired row.
function getRowColorsString(row) {

    // Use the row and the tileStates matrix to concatenate a string.
    tiles = '';
    for(var i = 0; i < BOARD_COLUMNS; i++) {
        tiles += tileStates[row][i];
    }
    return tiles;

}

// Uses the input from the submitted row to suggest the next word.
function processInput(currRow) {

    // Store the tile code within a string using tileStates matrix.
    var tiles = getRowColorsString(row);

    // Complete the puzzle with 'user' if they mark all tiles as green.
    if(tiles == '22222') {
        setTimeout(() => {
            completed(currentWordEntered, 'user');
        }, ROTATION_DELAY * (BOARD_COLUMNS + 1));
        return true;
    }

    // DEBUGGING INFO
    console.log(currentWordEntered, tiles);

    // Determine the best next word using this information.
    updateKnownLetters();
    filterWords();
    
    // Compute ranks for each viable word using the defauly algorithm.
    ranks = getRankings(words);

    // DEBUGGING INFO
    console.log(ranks);

    // Store the best suggestion if at least one exists.
    if(ranks.length > 0) {
        suggestion = ranks[0][0];
    }

    // Complete the puzzle with 'no-find' if there are no suggestions.
    else if(ranks.length == 0) {
        completed(null, 'no-find');
        return;
    }

    // Should wait until rotation completes to display next suggestion.
    setTimeout(() => {
        displaySuggestion(currRow + 1, ranks);
    }, BOARD_ROWS * ROTATION_DELAY);

    // Should wait until suggestions appears to determine if the puzzle is complete.
    setTimeout(() => {

        // Complete the puzzle with 'program-found' if there is only one suggestion left.
        if(ranks.length == 1) {

            // DEBUGGING INFO
            console.log('solved!');
            completed(suggestion, 'program-found');
        }
    
        // Otherwise, reenable typing and clicking.
        else {
            typingEnabled = true;
            clickingEnabled = true;
        }

    }, (BOARD_ROWS -1) * (ROTATION_DELAY + SUGGESTION_DELAY));
    
}

// Display the stored suggestion on the next row of the game board.
function displaySuggestion(rowToDisplay, ranks=null) {

    // Add the suggested letter after the SUGGESTION_DELAY for each tile.
    setTimeout(() => {
        $(`#${rowToDisplay}0`).text(suggestion[0]);
        $(`#${rowToDisplay}0`).addClass("suggestion");
    }, 0 * SUGGESTION_DELAY);
    setTimeout(() => {
        $(`#${rowToDisplay}1`).text(suggestion[1]);
        $(`#${rowToDisplay}1`).addClass("suggestion");
    }, 1 * SUGGESTION_DELAY);
    setTimeout(() => {
        $(`#${rowToDisplay}2`).text(suggestion[2]);
        $(`#${rowToDisplay}2`).addClass("suggestion");
    }, 2 * SUGGESTION_DELAY);
    setTimeout(() => {
        $(`#${rowToDisplay}3`).text(suggestion[3]);
        $(`#${rowToDisplay}3`).addClass("suggestion");
    }, 3 * SUGGESTION_DELAY);
    setTimeout(() => {
        $(`#${rowToDisplay}4`).text(suggestion[4]);
        $(`#${rowToDisplay}4`).addClass("suggestion");
    }, 4 * SUGGESTION_DELAY);
    setTimeout(() => {
        $(`#${rowToDisplay}5`).text(suggestion[5]);
        $(`#${rowToDisplay}5`).addClass("suggestion");

        // Modify the list of suggested words in the left menu.
        updateMenuList(ranks);

    }, 5 * SUGGESTION_DELAY);

}

// Updates arrays based on the guess provided.
function updateKnownLetters() {
    
    // Loop through each letter of the guess.
    var grayLetters = [];
    var yellowLetters = [];
    for(i = 0; i < currentWordEntered.length; i++) {

        // Gray letters cannot immediately be ruled out yet.
        if(tiles[i] == 0) {
            grayLetters.push(currentWordEntered[i]);
        }

        // Yellow letters can immediately be inserted into incorrectPositions and 
        // containsLetters arrays, and are used later to consider duplicate gray letters.
        else if(tiles[i] == 1) {
            incorrectPositions[i].push(currentWordEntered[i]);
            containsLetters.push(currentWordEntered[i]);
            yellowLetters.push(currentWordEntered[i]);
        }

        // Green letters can immediately be inserted into the correctPositions array.
        else {
            correctPositions[i] = currentWordEntered[i];
        }
            
    }

    // Stored gray letters are now considered.
    for(i = 0; i < grayLetters.length; i++) {

        // If a yellow tile of this letter exists, we cannot rule out the letter.
        if(yellowLetters.includes(grayLetters[i])) {
            continue;
        }

        // Otherwise, insert it into incorrectPositions wherever it does not 
        // also exist as a green tile in the puzzle.
        if(correctPositions[0] != grayLetters[i])
            incorrectPositions[0].push(grayLetters[i]);
        if(correctPositions[1] != grayLetters[i])
            incorrectPositions[1].push(grayLetters[i]);
        if(correctPositions[2] != grayLetters[i])
            incorrectPositions[2].push(grayLetters[i]);
        if(correctPositions[3] != grayLetters[i])
            incorrectPositions[3].push(grayLetters[i]);
        if(correctPositions[4] != grayLetters[i])
            incorrectPositions[4].push(grayLetters[i]);
    }

    // DEBUGGING INFO
    console.log("correctPositions", correctPositions);
    console.log("incorrectPositions", incorrectPositions);
 
}

// Filters the list of words to only contain remaining possibilities.
function filterWords() {

    // Traverse the list of remaining words, marking those to be removed.
    var marked = [];
    for(i = 0; i < words.length; i++) {
        
        // If they are missing a required letter...
        if((correctPositions[0] != '' && words[i][0] != correctPositions[0]) || (correctPositions[1] != '' && words[i][1] != correctPositions[1]) || (correctPositions[2] != '' && words[i][2] != correctPositions[2]) || (correctPositions[3] != '' && words[i][3] != correctPositions[3]) || (correctPositions[4] != '' && words[i][4] != correctPositions[4])) {
            marked.push(words[i]);
        }

        // If they contain a letter in an incorrect position...
        if((incorrectPositions[0].includes(words[i][0])) || (incorrectPositions[1].includes(words[i][1])) || (incorrectPositions[2].includes(words[i][2])) || (incorrectPositions[3].includes(words[i][3])) || (incorrectPositions[4].includes(words[i][4]))) {
            marked.push(words[i]);
        }

        // If the word does not contain all of the correct letters...
        for(j = 0; j < containsLetters.length; j++) {
            if(words[i].includes(containsLetters[j]) == false) {
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
// This is the actual algorithm for determining the next suggested word.
function getRankings() {

    // Find the most common letter / position combinations.
    // e.g. {'E' => 13, 'C' => 4} for a single position in the word.
    var combinationMapping = [{}, {}, {}, {}, {}];
    for(var i = 0; i < words.length; i++) {
        for(var j = 0; j < BOARD_COLUMNS; j++) {
            if((Object.keys(combinationMapping[j])).includes(words[i][j]) == false) {
                combinationMapping[j][words[i][j]] = 0;
            }
            combinationMapping[j][words[i][j]] += 1;
        }
    }

    // Calculate a ranking score for each word in the 'words' array based
    // on the most common letter / position combinations determined above.
    var wordRankingScores = [];
    var half = words.length / 2;
    for(var i = 0; i < words.length; i++) {
        var rank = 0;
        for(var j = 0; j < BOARD_COLUMNS; j++) {
            rank += Math.abs(half - combinationMapping[j][words[i][j]])
        }
        wordRankingScores.push(rank)
    }

    // Generate a list of words and their ranks.
    var wordRankingScoresCopy = [...wordRankingScores];
    var sortedWordRankTuples = [];
    for(var i = 0; i < words.length; i++) {
        sortedWordRankTuples.push([words[i], wordRankingScoresCopy[i]]);
    }

    // Sort and return the list of 2-tuples.
    return sortedWordRankTuples.sort((a,b) => a[1] -b[1]);

}

// Displays the victory screen for a solved word.
function completed(word, mode) {

    // Start by disabling clicking and typing.
    clickingEnabled = false;
    typingEnabled = false;

    // If the user indicates that the puzzle is solved...
    if(mode == 'user' && !doneRunning) {
        
        // Mark the program as done running and bounce to indicate success.
        doneRunning = true;
        bounceRow(currRow - 1);

        // Show the modal after the letters bounce.
        setTimeout(() => {
            toggleStatsMenu(word, mode);
        }, (BOARD_COLUMNS * TILE_BOUNCE_TIME) + MODAL_DELAY);

    }

    // If the program hits the bottom of the puzzle before being solved...
    if(mode == 'hit-bottom' && !doneRunning) {
        doneRunning = true;
        setTimeout(() => {
            toggleStatsMenu(word, mode);
        }, MODAL_DELAY + (ROTATION_DELAY * BOARD_COLUMNS));
    }

    // If the input prevents a word from being found...
    if(mode == 'no-find'  && !doneRunning) {
        doneRunning = true;
        setTimeout(() => {
            toggleStatsMenu(word, mode);
        }, MODAL_DELAY + (ROTATION_DELAY * BOARD_COLUMNS));
    }

    // If the program determines the solution to the puzzle...
    if(mode == 'program-found'  && !doneRunning) {
        
        // Mark the program as done running and color / bounce solution.
        doneRunning = true;
        setTimeout(() => {
            colorSolution(currRow);
            setTimeout(() => {
                bounceRow(currRow);

                // Show the modal after animations conclude.
                setTimeout(() => {
                    toggleStatsMenu(word, mode);
                }, (BOARD_COLUMNS * TILE_BOUNCE_TIME) + MODAL_DELAY);

            }, BOARD_COLUMNS * SUGGESTION_DELAY); 
        }, SUGGESTION_DELAY);
                       
    }

}

// Toggles the statistics modal on the screen.
function toggleStatsMenu(word, mode) {

    // Set the mode upon first stats display.
    if(!statsMode) {
        statsMode = mode;
        statsWord = word;
    }

    // Enable the stats modal for toggling.
    statsEnabled = true;

    // Toggle the modal based on whether or not it is currently showing.
    if(!showingStats) {
        showResults(word);
    }
    else {
        stopShowingResults();
    }
}

// Show the results modal on screen.
function showResults(word) {

    // Update the status of the stats modal.
    showingStats = true;

    // Make the completion menu visible.
    $("div.stats-wrapper").removeClass("done-showing").addClass("showing-stats");
    $("div.stats-board").removeClass("done-showing").addClass("showing-stats");
    $("div.filter").removeClass("done-showing").addClass("showing-stats");

    // Add content to the completion menu.
    $("p.title").text(messages[statsMode + "_t"]);
    $("#i1").text(messages[statsMode]);
    $("#i2").text(messages['common']);

}

// Remove the results modal from the screen.
function stopShowingResults() {

    // Update the status of the stats modal.
    showingStats = false;

    // Make the completion menu hidden.
    $("div.stats-wrapper").removeClass("showing-stats").addClass("done-showing");
    $("div.stats-board").removeClass("showing-stats").addClass("done-showing");
    $("div.filter").removeClass("showing-stats").addClass("done-showing");

}

// Makes the passed row bounce to indicate a solved puzzle.
function bounceRow(row) {

    setTimeout(() => {
        $(`#${row}${0}`).addClass("bounce");
    }, 0 * TILE_BOUNCE_TIME);
    setTimeout(() => {
        $(`#${row}${1}`).addClass("bounce");
    }, 1 * TILE_BOUNCE_TIME);
    setTimeout(() => {
        $(`#${row}${2}`).addClass("bounce");
    }, 2 * TILE_BOUNCE_TIME);
    setTimeout(() => {
        $(`#${row}${3}`).addClass("bounce");
    }, 3 * TILE_BOUNCE_TIME);
    setTimeout(() => {
        $(`#${row}${4}`).addClass("bounce");
    }, 4 * TILE_BOUNCE_TIME);

}

// Adds green color to the solution of the puzzle when the program finds it.
function colorSolution(row) {

    setTimeout(() => {
        $(`#${currRow}${0}`).addClass("green").removeClass("suggestion");
    }, 0 * SUGGESTION_DELAY);
    setTimeout(() => {
        $(`#${currRow}${1}`).addClass("green").removeClass("suggestion");
    }, 1 * SUGGESTION_DELAY);
    setTimeout(() => {
        $(`#${currRow}${2}`).addClass("green").removeClass("suggestion");
    }, 2 * SUGGESTION_DELAY);
    setTimeout(() => {
        $(`#${currRow}${3}`).addClass("green").removeClass("suggestion");
    }, 3 * SUGGESTION_DELAY);
    setTimeout(() => {
        $(`#${currRow}${4}`).addClass("green").removeClass("suggestion");
    }, 4 * SUGGESTION_DELAY);

}

// Updates the list of words in the left suggestion menu.
function updateMenuList() {

    // Get the necessary references.
    var menu = $('.menu-left');
    var newElement = '';

    // Only add the slide class if the menu is slid open already.
    var slide = menu.hasClass('slide') ? 'slide' : '';

    // Remove all words from the menu.
    menu.children().remove();

    // Append a new child for each suggestion.
    var remainingWords = MAX_SUGGESTED_WORDS;
    for(var i = 0; i < ranks.length && remainingWords > 0; i++, remainingWords--) {
        newElement = `<div class="block-text-container">
            <div class="block-text five ` + slide + `">` + ranks[i][0][4] + `</div>
            <div class="block-text four ` + slide + `">` + ranks[i][0][3] + `</div>
            <div class="block-text three ` + slide + `">` + ranks[i][0][2] + `</div>
            <div class="block-text two ` + slide + `">` + ranks[i][0][1] + `</div>
            <div class="block-text one ` + slide + `">` + ranks[i][0][0] + `</div>
        </div>`;
        menu.append(newElement);
    }
}

// New JQuery function to determine if an element is in the viewport.
$.fn.isInViewport = function() {
    var elementTop = $(this).offset().top;
    var elementBottom = elementTop + $(this).outerHeight();

    var viewportTop = $(window).scrollTop();
    var viewportBottom = viewportTop + $(window).height();

    return elementBottom > viewportTop && elementTop < viewportBottom;
};
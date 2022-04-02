currRow = 0
currCol = 0
tileStates = [
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1],
    [-1, -1, -1, -1, -1]
];

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

document.addEventListener("keydown", function(e) {
    key = e.key;

    console.log(`#${currRow}${currCol}`)
    // Handles typing of letters.
    if(key.charCodeAt(0) >= 97 && key.charCodeAt(0) <= 122) {
        
        if(currCol <= 4) {
            console.log(`#${currRow}${currCol}`)
            $(`#${currRow}${currCol}`).text(key.toUpperCase());
            currCol += 1;
        }

    }

    // Handles typing of backspace.
    if(key == 'Backspace') {
        
        if(currCol >= 1) {
            currCol -=1;
            $(`#${currRow}${currCol}`).text('');
        }
    }

    // Handles typing of enter.
    if(key == 'Enter') {
        
        if(currRow <= 4 && currCol == 5) {
            currCol = 0;
            currRow += 1;
        }

    }

});
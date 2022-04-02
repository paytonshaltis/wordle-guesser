currRow = 0
currCol = 0

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
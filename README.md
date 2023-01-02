# Wordle Guesser
A simple web application that helps suggest words for the popular word game Wordle.

## Current Features:
- Accept user input for the current status of the game. This includes indicating which words have been guessed, and which letters from these guesses were determined to be of which color (gray, yellow, or green).
- Generate a list of all possible words that _could_ be correct based on all previously-guessed words and the status of their letters.
- Use an original algorithm for determining the next best word to guess. The 'next best word' is determined based on how many other possible words can be eliminated through the evaluation of specific letters.

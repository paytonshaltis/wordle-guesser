import json
'''Returns a list of all Wordle word possibilities.'''
def getWords(words) -> list:

    # Read in all words from text file.
    with open('words.txt', 'r') as fp:
        words = fp.readlines()

    # Remove the newline character from each word.
    for i in range(len(words)):
        words[i] = words[i][0:-1].upper()


    with open('bozo.json', 'w') as fp:
        json.dump(words, fp)
        
    # Returns the newly assigned list of words.
    return words

    



'''Updates arrays based on the guess provided.'''
def makeGuess(guess, guess_outcome, correct_positions, incorrect_positions, contains_letters):
    
    # Loop through each letter of the guess.
    grays = []
    for i in range(len(guess)):

        # If the letter is gray...
        if int(guess_outcome[i]) == 0:

            # Mark it and check all positions after they have been revealed.
            grays.append(guess[i])

        # If the letter is yellow...
        elif int(guess_outcome[i]) == 1:
            incorrect_positions[i].append(guess[i])
            contains_letters.append(guess[i])

        # If the letter is green...
        else:
            correct_positions[i] = guess[i]

    # Need to consider the marked grays.
    print(grays)
    for letter in grays:
        
        # If the letter is on the board as a yellow, do nothing.
        if(contains_letters.count(letter) != 0):
            continue

        # Only rule it out of other non-green positions before this tile.
        if correct_positions[0] != letter:
            incorrect_positions[0].append(letter)
        if correct_positions[1] != letter:
            incorrect_positions[1].append(letter)
        if correct_positions[2] != letter:
            incorrect_positions[2].append(letter)
        if correct_positions[3] != letter:
            incorrect_positions[3].append(letter)
        if correct_positions[4] != letter:
            incorrect_positions[4].append(letter)



'''Filters the list of words to only contain remaining possibilities.'''
def filterWords(words, correct_positions, incorrect_positions, contains_letters):
    
    marked = []
    for i in range(len(words)):

        # If they are missing a required letter...
        if (correct_positions[0] != '' and words[i][0] != correct_positions[0]) or (correct_positions[1] != '' and words[i][1] != correct_positions[1]) or (correct_positions[2] != '' and words[i][2] != correct_positions[2]) or (correct_positions[3] != '' and words[i][3] != correct_positions[3]) or (correct_positions[4] != '' and words[i][4] != correct_positions[4]):
            marked.append(words[i])

        # If they contain a letter in an incorrect position...
        if (incorrect_positions[0].count(words[i][0]) != 0) or (incorrect_positions[1].count(words[i][1]) != 0) or (incorrect_positions[2].count(words[i][2]) != 0) or (incorrect_positions[3].count(words[i][3]) != 0) or (incorrect_positions[4].count(words[i][4]) != 0):
            marked.append(words[i])

        # If the word does not contain all of the correct letters...
        for letter in contains_letters:
            if words[i].count(letter) == 0:
                marked.append(words[i])

    # Remove the marked words for deletion.
    for word in marked:
        if words.count(word) != 0:
            words.remove(word)



'''Return a list of 2-tuples containing sorted words and their ranks.'''
def getRankings(words) -> list:

    # Find the most common letter / position combinations.
    mapping = [{}, {}, {}, {}, {}]
    for word in words:
        for i in range(5):
            if list(mapping[i].keys()).count(word[i]) == 0:
                mapping[i][word[i]] = 0
            mapping[i][word[i]] += 1

    words_ranks = []
    half = len(words) / 2
    for word in words:
        rank = 0
        for i in range(5):
            rank += abs(half - mapping[i][word[i]])
        words_ranks.append(rank)

    print(mapping)

    # Match each word with its ranking.
    sorted_ranks = words_ranks[:]
    result = []
    for i in range(len(words)):
        result.append((words[i], sorted_ranks[i]))
    
    # Sort the list of 2-tuples
    result.sort(key=lambda x: x[1], reverse=False)

    # Return the list of 2-tuples.
    return result



# Main actions of the program.
words = []
correct_positions   = ['', '', '', '', '']
incorrect_positions = [[], [], [], [], []]
contains_letters    = []

start = True
while len(words) > 1 or start:
    start = False
    guess = input('Enter your first GUESS:')
    outcome = input('Enter your first OUTCOME:')

    words = getWords(words)
    makeGuess(guess, outcome, correct_positions, incorrect_positions, contains_letters)
    filterWords(words, correct_positions, incorrect_positions, contains_letters)
    ranks = getRankings(words)

    for word, rank in ranks:
        print(word, rank)

    print(ranks[0][0])
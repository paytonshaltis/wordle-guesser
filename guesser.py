FIRST_GUESS     = 'RATES'
FIRST_OUTCOME   = '10110'

# Contains the correct letter at each position.
correct_positions   = ['', '', '', '', '']

# Contains an array of incorrect letters at each position.
incorrect_positions = [[], [], [], [], []]

# Contains letters that must be in the word.
contains_letters    = []

# Read in all words from text file.
words = []
with open('words.txt', 'r') as fp:
    words = fp.readlines()

# Remove the newline character from each word.
for i in range(len(words)):
    words[i] = words[i][0:-1].upper()

# Process the first word guess results.
for i in range(len(FIRST_GUESS)):

    # If the letter is gray...
    if int(FIRST_OUTCOME[i]) == 0:

        # Only rule it out of other non-green positions.
        if correct_positions[0] != FIRST_GUESS[i]:
            incorrect_positions[0].append(FIRST_GUESS[i])
        if correct_positions[1] != FIRST_GUESS[i]:
            incorrect_positions[1].append(FIRST_GUESS[i])
        if correct_positions[2] != FIRST_GUESS[i]:
            incorrect_positions[2].append(FIRST_GUESS[i])
        if correct_positions[3] != FIRST_GUESS[i]:
            incorrect_positions[3].append(FIRST_GUESS[i])
        if correct_positions[4] != FIRST_GUESS[i]:
            incorrect_positions[4].append(FIRST_GUESS[i])

    # If the letter is yellow...
    elif int(FIRST_OUTCOME[i]) == 1:
        incorrect_positions[i].append(FIRST_GUESS[i])
        contains_letters.append(FIRST_GUESS[i])

    # If the letter is green...
    else:
        correct_positions[i] = FIRST_GUESS[i]

# Print out the arrays for checking.
print(correct_positions)
print(incorrect_positions)
print(contains_letters)

# Mark incorrect words for deletion.
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

# Find the most common letter / position combinations.
mapping = [{}, {}, {}, {}, {}]
for word in words:
    for i in range(5):
        if list(mapping[i].keys()).count(word[i]) == 0:
            mapping[i][word[i]] = 0
        mapping[i][word[i]] += 1

# Find all letter / position combo that occur about half of the time. This is defined
# as (number of words / 2) +- (number of words / 10)
# Find words with the most letter / position combos from above
print(len(words))

print(mapping)
print(words)
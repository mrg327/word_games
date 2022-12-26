import math
'''
This script will solve a 2D word game.

The game is played on a square grid of letters. 
The goal is to find words in the grid. 
Words can be found by starting at any letter and moving to adjacent letters (horizontally, vertically, or diagonally) to form a word. 
Words must be at least three letters long, may not wrap around the edges of the grid, and may not reuse any letters.

The words to compare against is stored in the text file "all_words.txt".
The game is a simple list of letters, given as an input into the game solver.

The game solver will return a list of all words found in the grid in order of length, with the longest words listed first.

'''

def read_words():
    '''Reads the words from the file and returns a list of words.'''
    with open("functions/all_words.txt", "r", encoding='latin-1') as f:
        words = f.read().splitlines()
        words = [word.lower() for word in words if len(word) >= 3] 
    return words

def find_words(grid, words):
    '''Finds all the words in the grid and returns a list of words.'''
    found_words = []
    for word in words:
        if find_word(grid, word):
            found_words.append(word)
    return found_words

def find_word(grid, word):
    '''Finds the word in the grid and returns True if found, False otherwise.'''
    for row in range(len(grid)):
        for col in range(len(grid[row])):
            if search(grid, word, row, col):
                return True
    return False

def search(grid, word, row, col):
    '''Searches the grid for the word and returns True if found, False otherwise.'''
    if len(word) == 0: # All characters found
        return True
    if row < 0 or row >= len(grid) or col < 0 or col >= len(grid[row]) or grid[row][col] != word[0]:
        return False
    temp = grid[row][col] # Remember the letter
    grid[row][col] = '.' # Mark as visited

    result = search(grid, word[1:], row-1, col-1) or \
             search(grid, word[1:], row-1, col) or \
             search(grid, word[1:], row-1, col+1) or \
             search(grid, word[1:], row, col-1) or \
             search(grid, word[1:], row, col+1) or \
             search(grid, word[1:], row+1, col-1) or \
             search(grid, word[1:], row+1, col) or \
             search(grid, word[1:], row+1, col+1)
    
    grid[row][col] = temp # Restore the letter
    return result

def complete_solve_game(input_str):
    '''This function will solve the game and return the list of words.'''
    words = read_words()
    game_board = input_str
    b_size = int(math.sqrt(len(game_board)))
    grid = [list(game_board[i:i+b_size]) for i in range(0, len(game_board), b_size)]
    found_words = find_words(grid, words)
    # sort the list of words by length, with the longest words first
    found_words.sort(key=len, reverse=True)

    # find the paths for the words
    paths = word_paths(grid, found_words)

    return found_words , paths

def word_paths(grid, solutions):
    '''This function will return the input solutions list with tuples of the word and the path.'''
    paths = []
    for word in solutions:
        paths.append([word, find_word_path(grid, word)])
    return paths

def find_word_path(grid, word):
    '''Finds the word in the grid and returns the word and the path.'''
    for row in range(len(grid)):
        for col in range(len(grid[row])):
            path = search_path(grid, word, row, col)
            if path:
                return (word, path)
    return (word, [])

def search_path(grid, word, row, col):
    '''Searches the grid for the word and returns the path if found, [] otherwise.'''
    if len(word) == 0: # All characters found
        return []
    if row < 0 or row >= len(grid) or col < 0 or col >= len(grid[row]) or grid[row][col] != word[0]:
        return []
    temp = grid[row][col] # Remember the letter
    grid[row][col] = '.' # Mark as visited
    path = [(row, col)]
    result = search_path(grid, word[1:], row-1, col-1) or \
             search_path(grid, word[1:], row-1, col) or \
             search_path(grid, word[1:], row-1, col+1) or \
             search_path(grid, word[1:], row, col-1) or \
             search_path(grid, word[1:], row, col+1) or \
             search_path(grid, word[1:], row+1, col-1) or \
             search_path(grid, word[1:], row+1, col) or \
             search_path(grid, word[1:], row+1, col+1)
    
    grid[row][col] = temp # Restore the letter
    if result:
        path.extend(result)
    return path

def main():
    '''Main function.'''
    words = read_words()
    game_board = 'odffnfdjdiekennf'
    words, paths = complete_solve_game(game_board)
    print(paths)

if __name__ == '__main__':
    main()  # Call the main function

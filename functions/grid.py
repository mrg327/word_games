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
    paths = decode_paths(grid, paths)

    return found_words , paths

def word_paths(grid, solutions):
    '''This function will return the input solutions list with tuples of the word and the path.'''
    paths = []
    for word in solutions:
        paths.append([word, find_word_path(grid, word)])
    return paths

def find_word_path(grid, word):
    '''This function will return the path for the word.'''
    path = []
    for row in range(len(grid)):
        for col in range(len(grid[row])):
            if search_path(grid, word, row, col, path):
                return path
    return path

def decode_paths(grid, paths):
    '''This function will decode the paths and return a list of tuples.'''
    # The tuple looks like (str: word, list: (str: direction, int: cell))
    # each tuple contins a word and an interior list of tuples
    # each interior tuple contains a direction and a cell and it is the length of the word
    # valid directions are: n, ne, e, se, s, sw, w, nw
    # valid cells are: 0:15
    decoded_paths = []
    for path in paths:
        decoded_path = []
        for i in range(len(path[1])-1):
            r, c = path[1][i]
            decoded_path.append((decode_direction(grid, path[1][i], path[1][i+1]), r*len(grid)+c))
        decoded_paths.append(decoded_path)
        # add the last cell
        r, c = path[1][-1]
        decoded_paths[-1].append((None, r*len(grid)+c))
    return decoded_paths

def decode_direction(grid, cell1, cell2):
    '''This function will return the direction from cell1 to cell2.'''
    dir_str = ''    
    if cell1[0] > cell2[0]:
        dir_str += 'n'
    elif cell1[0] < cell2[0]:
        dir_str += 's'
    if cell1[1] > cell2[1]:
        dir_str += 'w'
    elif cell1[1] < cell2[1]:
        dir_str += 'e'
    return dir_str


def search_path(grid, word, row, col, path):
    '''This function will search the grid for the word and return the path.'''
    if len(word) == 0: # All characters found
        return True
    if row < 0 or row >= len(grid) or col < 0 or col >= len(grid[row]) or grid[row][col] != word[0]:
        return False
    temp = grid[row][col] # Remember the letter
    grid[row][col] = '.' # Mark as visited
    path.append((row, col))

    result = search_path(grid, word[1:], row-1, col-1, path) or \
             search_path(grid, word[1:], row-1, col, path) or \
             search_path(grid, word[1:], row-1, col+1, path) or \
             search_path(grid, word[1:], row, col-1, path) or \
             search_path(grid, word[1:], row, col+1, path) or \
             search_path(grid, word[1:], row+1, col-1, path) or \
             search_path(grid, word[1:], row+1, col, path) or \
             search_path(grid, word[1:], row+1, col+1, path)
    
    grid[row][col] = temp # Restore the letter
    if not result:
        path.pop()
    return result

def main():
    '''Main function.'''
    words = read_words()
    game_board = 'odffnfdjdiekennf'
    words, paths = complete_solve_game(game_board)
    print(paths)

if __name__ == '__main__':
    main()  # Call the main function

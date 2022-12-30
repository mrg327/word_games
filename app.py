from flask import Flask, render_template, request
from functions.grid import *

app = Flask(__name__)

@app.route('/')
def hello():
    return render_template('index.html')

# create a page for the grid
@app.route('/grid')
def grid():
    return render_template('grid.html')

# create the solve_game function
@app.route('/solve_game', methods=['POST'])
def solve_game():
    input_str = request.json['input']
    # parse the input string for malwares
    found_words, paths = complete_solve_game(input_str)
    return {'found_words': found_words, 'paths': paths}


if __name__ == '__main__':
    app.run(debug=True)

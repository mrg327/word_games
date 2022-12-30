// Get the input form and grid elements
const form = document.getElementById("form");
const indexForm = document.getElementById("idx-form");
const button = document.getElementById("button");
const arrowButton = document.getElementById("arrow-button");
const grid = document.getElementById("grid");

let solutions = document.getElementById("solutions");
let timeoutId;
let t_inp_str = "";
let t_idx = -1;
let arrows_present = false;

const arrow_dirs = ["nw", "n", "ne", "e", "se", "s", "sw", "w"];

// Add an event listener to the form to handle the submission
// q: what even listener do I use for a button?
// a: use the click event listener
button.addEventListener("click", event => {
    // Copy the test string to the form input
    form.elements.input.value = "sershpctlanhpmia";
    // Clear any existing timeout
    clearTimeout(timeoutId);
    // Draw the grid
    drawGrid(form);
    // refresh the page
    refresh();
});

arrowButton.addEventListener("click", event => {
    // get the input from the index form
    const userIdx = indexForm.elements.idx.value;
    console.log(userIdx);
    // write the arrows for the test index if data exists
    if (window.data){
    addArrows(window.data, userIdx - 1);}
});

// add a listener for the right arrow key
document.addEventListener("keydown", event => {
    // if the right arrow key is pressed
    if (event.keyCode == 39) {
        // get the t_idx and add 1
        const userIdx = t_idx + 1;
        // set the id-form idx value
        indexForm.elements.idx.value = userIdx + 1;
        // write the arrows for the test index if data exists
        if (window.data){
        addArrows(window.data, userIdx);}
    }
    // if the left arrow key is pressed
    if (event.keyCode == 37) {
        // get the t_idx and subtract 1
        const userIdx = t_idx - 1;
        // set the id-form idx value
        indexForm.elements.idx.value = userIdx + 1;
        // write the arrows for the test index if data exists
        if (window.data){
        addArrows(window.data, userIdx);}
    }
    // if the down arrow key is pressed
    if (event.keyCode == 40) {
        // clear the arrows
        refresh();
        // set the user index to 0
        indexForm.elements.idx.value = 0;
        // set the test index to -1
        t_idx = -1;
    }
    console.log(userIdx);
});

// Add an event listener to the form to handle the submission
form.addEventListener("input", event => {
        // Clear any existing timeout
    clearTimeout(timeoutId);

    // Set a new timeout to execute the function after 500 milliseconds
    timeoutId = setTimeout(() => {
        // Do something with the input value
        console.log("");
    }, 500);

    // Prevent the default form submission behavior
    event.preventDefault();
    drawGrid(form);

    
});

// listen for hte form to be submitted
form.addEventListener("submit", event => {
    // Prevent the default form submission behavior
    event.preventDefault();
    drawGrid(form);
});

// listen for hte form to be submitted
indexForm.addEventListener("submit", event => {
    // Prevent the default form submission behavior
    event.preventDefault();

    const userIdx = indexForm.elements.idx.value;
    console.log(userIdx);
    // write the arrows for the test index if data exists
    if (window.data){
    addArrows(window.data, userIdx - 1);}
});

// create a function to draw the grid and fatch the solutions
function drawGrid(form) {
        // Get the input string from the form
        const form_input = form.elements.input.value;

        // do the following code only if the input length has an integer square root
        if (Number.isInteger(Math.sqrt(form_input.length)) && (form_input != t_inp_str) && (form_input.length > 0)){
        t_inp_str = form_input;
        // verify that the input string is valid


        // Send the input string to the server using an AJAX request
        fetch("/solve_game", {
          method: "POST",
          body: JSON.stringify({ input: form_input }),
          headers: {
            "Content-Type": "application/json"
          }
        })
          .then(response => response.json())
          .then(data => {
            // Do something with the response data here
            console.log(data);
            // generate HTML for the list of solutions
            let solutionsHTML = "<ul class='sol-list'>";
            for (let i = 0; i < data.found_words.length; i++) {
                solutionsHTML += `<li class='sol-item'>${i+1}. ${data.found_words[i]}</li>`;
            }
            solutionsHTML += "</ul>";
            // Update the solutions HTML
            solutions.innerHTML = solutionsHTML;
            // log the solutions to the console
            console.log(solutions);
            // persist the data
            window.data = data;
            // persist the form input
            window.form_input = form_input;
    
          })
          .catch(error => {
            // return the error page if the server is down
            console.log(error);
            window.location.href = "/error";
          });
    
        // Get the input string from the form
        const input = form.elements.input.value;
    
        // Calculate the size of the grid based on the length of the input string
        const gridSize = Math.ceil(Math.sqrt(input.length)); // Round up to the nearest integer
    
        // Generate the grid HTML
        let gridHTML = "";
        var cell_id = 0;
        for (let i = 0; i < gridSize; i++) {
        gridHTML += "<div class='row'>";
        for (let j = 0; j < gridSize; j++) {
            const index = i * gridSize + j;
            const letter = input[index] || "";
            gridHTML += `<div class='cell' id='cell_${cell_id}'>`
            // add if statement for checkered styling
            // if (i % 2 == 0 && j % 2 == 0 || i % 2 != 0 && j % 2 != 0) gridHTML += ` style='background-color: #f2f2f2;'`;
            gridHTML += `<div id='overlay-text'>${letter}</div> <div id="arrow-${cell_id}"></div></div>`;
            cell_id += 1;
        }
        gridHTML += "</div>";
        }
        // pretty print the grid HTML to the console
        console.log(gridHTML);
        // Update the grid HTML
        grid.innerHTML = gridHTML;

        // update the flex of the grid to the size of the grid
    
        // print grid to console
        console.log(grid);

        };
    };    

function refresh(){
    // iterate over the cells and set all opacities to 0
    for (let i = 0; i < window.form_input.length; i++) {
        // get the cell id
        let cell_id = i;
        // set the class back to only the cell class
        document.getElementById(`arrow-${cell_id}`).className = "";
        // set the background color back to --background-color
        document.getElementById(`cell_${cell_id}`).style.backgroundColor = "var(--background-color)";
    }
}


    // write a function to add the arrow classes to the cells
function addArrows(data, word_idx) {
    // if (arrows_present) {
    // iterate over the cells and set all opacities to 0
    refresh()
    // arrows_present = false;}
    // else{
    // for each subarray in the paths array
    for (let i = 0; i < data.paths[word_idx].length; i++) {
        // if i == length - 1
        if (i == data.paths[word_idx].length -1) document.getElementById(`cell_${data.paths[word_idx][data.paths[word_idx].length -1][1]}`).style.backgroundColor = "#d4777b";
        else document.getElementById(`cell_${data.paths[word_idx][i][1]}`).style.backgroundColor = "#a6c1f7";
        // if i = 0
        if (i == 0) document.getElementById(`cell_${data.paths[word_idx][0][1]}`).style.backgroundColor = "#77d477";
        // get the cell id
        let cell_id = data.paths[word_idx][i][1];
        // get the direction
        let dir = data.paths[word_idx][i][0];
        // add the arrow class to the cell
        document.getElementById(`arrow-${cell_id}`).classList.add(`arrow-${dir}`);
        // set the opacity of the cell to 1
        document.getElementById(`arrow-${cell_id}`).style.opacity = 1;
        arrows_present = true;
}
// color the first and last cells
t_idx = word_idx;
// }

// update the current-sol h1 to the current solution
document.getElementById("current-sol").innerHTML = `Current Solution: ${data.found_words[word_idx]}`;
};

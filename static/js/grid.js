// Get the input form and grid elements
const form = document.getElementById("form");
const button = document.getElementById("button");
const grid = document.getElementById("grid");
let solutions = document.getElementById("solutions");

let timeoutId;
let t_inp_str = "";

// Add an event listener to the form to handle the submission
// q: what even listener do I use for a button?
// a: use the click event listener
button.addEventListener("click", event => {
    // Copy the test string to the form input
    form.elements.input.value = "manqwertyuiopasd";
    // Clear any existing timeout
    clearTimeout(timeoutId);
    // Draw the grid
    drawGrid(form);
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

// create a function to draw the grid and fatch the solutions
function drawGrid(form) {
        // Get the input string from the form
        const form_input = form.elements.input.value;

        // do the following code only if the input length has an integer square root
        if (Number.isInteger(Math.sqrt(form_input.length)) && (form_input != t_inp_str) && (form_input.length > 0)){
        t_inp_str = form_input;
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
            gridHTML += `<div class='cell' id='cell_${cell_id}'`
            // add if statement for checkered styling
            // if (i % 2 == 0 && j % 2 == 0 || i % 2 != 0 && j % 2 != 0) gridHTML += ` style='background-color: #f2f2f2;'`;
            gridHTML += `>${letter}</div>`;
            cell_id += 1;
        }
        gridHTML += "</div>";
        }
        // pretty print the grid HTML to the console
        console.log(gridHTML);
        // Update the grid HTML
        grid.innerHTML = gridHTML;
    
        // print grid to console
        console.log(grid);
        };
    };    

// Get the "add" form using its name attribute
var addForm = document.forms.add;

// Get the "edit" form using its name attribute
var editForm = document.forms.edit;

// Select the main wrapper div (used to apply blur effect)
var blurEffect = document.querySelector(".wrapper");

// Retrieve todos from localStorage and convert from JSON string to array
// If nothing exists, use an empty array
var todosDB = JSON.parse(localStorage.getItem("TodosDB")) || [];

// This will store the index of the todo currently being edited
let editingIndex = null;

// Immediately display todos when page loads
renderTodos();


// ==========================
// ADD NEW TODO
// ==========================
addForm.addEventListener("submit", (e) => {

  // Prevent page from refreshing after form submission
  // e.preventDefault();

  // Get the input value and remove extra spaces
  const val = addForm.elements[0].value.trim();

  // If input is empty, stop execution
  if (!val) { return };

  // Add new todo at the beginning of array
  // Format: [todoText, status]
  todosDB.unshift([val, "pending"]);

  // Save updated todos to localStorage
  localStorage.setItem("TodosDB", JSON.stringify(todosDB));

  // Re-render updated todos on screen
  renderTodos();
});


// ==========================
// FUNCTION TO DISPLAY TODOS
// ==========================
function renderTodos() {

  // Select the div where todos are displayed
  const list = document.getElementById("list");

  // Clear existing todos from the DOM
  list.innerHTML = "";

  // Loop through todos array
  todosDB.forEach((tododb, index) => {

    // Create a new div for each todo
    const todo = document.createElement("div");

    // Add CSS class "todo"
    todo.classList.add("todo");

    // Insert HTML structure inside todo div
    todo.innerHTML = `
      <p>${tododb[0]}</p>
      <div class="actions"> 
        <span class="editTodo">✏️</span>
        <span class="delTodo">🗑️</span>
        <input type="checkbox" class="state">
      </div>
    `;

    // Select elements inside the created todo
    const p = todo.querySelector("p");
    const checkBox = todo.querySelector(".state");
    const editBtn = todo.querySelector(".editTodo");
    const delBtn = todo.querySelector(".delTodo");

    // Check if todo is completed
    const isCompleted = tododb[1] === "completed";

    // Restore checkbox state
    checkBox.checked = isCompleted;

    // Apply line-through if completed
    p.style.textDecoration = isCompleted ? "line-through" : "none";

    // Change text color if completed
    p.style.color = isCompleted ? "rgba(255, 0, 0, 0.65)" : "inherit";


    // ==========================
    // TOGGLE COMPLETE STATUS
    // ==========================
    checkBox.addEventListener("change", () => {

      // Get current checkbox state
      const done = checkBox.checked;

      // Update status in array
      todosDB[index][1] = done ? "completed" : "pending";

      // Save updated array
      localStorage.setItem("TodosDB", JSON.stringify(todosDB));

      // Re-render todos
      renderTodos();
    });


    // ==========================
    // DELETE TODO
    // ==========================
    delBtn.addEventListener("click", () => {

      // Remove selected todo from array
      todosDB.splice(index, 1);

      // Save updated array
      localStorage.setItem("TodosDB", JSON.stringify(todosDB));

      // Re-render list
      renderTodos();
    });


    // ==========================
    // OPEN EDIT FORM
    // ==========================
    editBtn.addEventListener("click", () => {

      // Store index of selected todo
      editingIndex = index;

      // Show edit form
      editForm.style.display = "flex";

      // Apply blur effect to background
      blurEffect.classList.add("effect");

      // Insert existing todo text into input field
      document.getElementById("editField").value = todosDB[index][0];
    });

    // Add todo to the list container
    list.appendChild(todo);
  });
}


// ==========================
// SAVE EDITED TODO
// ==========================
editForm.addEventListener("submit", (e) => {

  // Prevent form from refreshing page
  // e.preventDefault();

  // If no todo is selected for editing, stop
  if (editingIndex === null) return;

  // Get edit input field
  const field = document.getElementById("editField");

  // Get new value and remove extra spaces
  const newText = field.value.trim();

  // If empty, stop
  if (!newText) return;

  // Update todo text in array
  todosDB[editingIndex][0] = newText;

  // Save updated array
  localStorage.setItem("TodosDB", JSON.stringify(todosDB));

  // Hide edit form
  editForm.style.display = "none";

  // Remove blur effect
  blurEffect.classList.remove("effect");

  // Re-render todos
  renderTodos();
});


// ==========================
// CLOSE FORMS USING ESC KEY
// ==========================
document.addEventListener("keyup", (e) => {

  // If Escape key is pressed
  if (e.key === "Escape") {

    // Hide add form
    addForm.style.display = "none";

    // Hide edit form
    editForm.style.display = "none";

    // Remove blur effect
    blurEffect.classList.remove("effect");
  }
});


// ==========================
// CLEAR ALL TODOS
// ==========================
document.getElementById("clearAll").addEventListener("click", () => {

  // Replace stored todos with empty array
  localStorage.setItem("TodosDB", JSON.stringify([]));

  // Reload page to reflect changes
  window.location.reload();
});


// ==========================
// OPEN ADD FORM
// ==========================
document.getElementById("addBtn").addEventListener("click", () => {

  // Show add form
  addForm.style.display = "flex";

  // Add blur effect
  blurEffect.classList.add("effect");

  // Clear previous input value
  addForm.elements[0].value = "";

  // Focus on input field
  addForm.elements[0].focus();
});


// ==========================
// FILTER SYSTEM
// ==========================

// Convert HTMLCollection to array
var filters = [...document.getElementsByClassName("filter")];


// SHOW ALL TODOS
document.getElementById("all").addEventListener("click", () => {

  // Remove active class from all filters
  filters.forEach(element => {
    element.classList.remove("active");
  });

  // Add active class to "All"
  document.getElementById("all").classList.add("active");

  // Reload full todos from storage
  todosDB = JSON.parse(localStorage.getItem("TodosDB")) || [];

  // Render full list
  renderTodos();
});


// SHOW ONLY PENDING TODOS
document.getElementById("pending").addEventListener("click", () => {

  filters.forEach(element => {
    element.classList.remove("active");
  });

  document.getElementById("pending").classList.add("active");

  // Filter only pending todos
  todosDB = todosDB.filter((e) => {
    if (e[1] == "pending") {
      return e;
    }
  });

  renderTodos();

  // Restore original array after rendering
  todosDB = JSON.parse(localStorage.getItem("TodosDB")) || [];
});


// SHOW ONLY COMPLETED TODOS
document.getElementById("completed").addEventListener("click", () => {

  filters.forEach(element => {
    element.classList.remove("active");
  });

  document.getElementById("completed").classList.add("active");

  // Filter only completed todos
  todosDB = todosDB.filter((e) => {
    if (e[1] == "completed") {
      return e;
    }
  });

  renderTodos();

  // Restore original array
  todosDB = JSON.parse(localStorage.getItem("TodosDB")) || [];
});


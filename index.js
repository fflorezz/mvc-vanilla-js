class Model {
  constructor() {
    this.todos = JSON.parse(localStorage.getItem("todos")) || [];
  }
  _commit(todos) {
    this.onTodoListChange(todos);
    localStorage.setItem("todos", JSON.stringify(todos));
  }

  addTodo(todoText) {
    const todo = {
      id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
      text: todoText,
      completed: false
    };
    this.todos.push(todo);

    this._commit(this.todos);
  }

  editTodo(id, updateText) {
    this.todos = this.todos.map(todo =>
      todo.id === id
        ? { id: todo.id, text: updateText, complete: todo.complete }
        : todo
    );

    this._commit(this.todos);
  }

  deleteTodo(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);

    this._commit(this.todos);
  }

  toggeTodo(id) {
    this.todos = this.todos.map(todo =>
      todo.id === id
        ? { id: todo.id, text: todo.text, complete: !todo.complete }
        : todo
    );

    this._commit(this.todos);
  }

  bindTodoListChanged(callback) {
    this.onTodoListChange = callback;
  }
}

class View {
  constructor() {
    this.root = this.getElement("#root");
    this.root.innerHTML = `
     <h1 class="title">Todos</h1>
      <form action="">
        <input type="text" placeholder="Add todo" name="todo">
        <button class="submit-btn">Submit</button>
        <ul class="todo-list"></ul>
      </form>    
    `;

    this.form = this.getElement("form");
    this.input = this.getElement("input");
    this.todoList = this.getElement(".todo-list");
    this.submitBtn = this.getElement(".submit-btn");

    this._temporaryTodoText;
    this._initLocalListeners();
  }

  _initLocalListeners() {
    this.todoList.addEventListener("input", event => {
      if (event.target.className === "editable") {
        this._temporaryTodoText = event.target.innerText;
      }
    });
  }

  bindEditTodo(handler) {
    this.todoList.addEventListener("focusout", event => {
      if (this._temporaryTodoText) {
        const id = parseInt(event.target.parentElement.id);

        handler(id, this._temporaryTodoText);
        this._temporaryTodoText = "";
      }
    });
  }

  createElement(tag, className) {
    const element = document.createElement(tag);
    if (className) element.classlist.add(className);

    return element;
  }

  getElement(selector) {
    const element = document.querySelector(selector);

    return element;
  }

  get _todoText() {
    return this.input.value;
  }

  _resetInput() {
    this.input.value = "";
  }

  displayTodos(todos) {
    // Delete all nodes
    while (this.todoList.firstChild) {
      this.todoList.removeChild(this.todoList.firstChild);
    }

    // Show default message
    if (todos.length === 0) {
      const p = this.createElement("p");
      p.textContent = "Nothing to do! Add a task?";
      this.todoList.append(p);
    } else {
      // Render todos
      todos.forEach(todo => {
        const li = document.createElement("li");
        li.id = todo.id;
        li.innerHTML = `
          <input type="checkbox" ${todo.complete ? "checked" : ""}>
          <span contenteditable="true" class="editable">${
            todo.complete ? `<s>${todo.text}</s>` : todo.text
          }</span>
          <button class="delete">Delete</button>  
        `;

        this.todoList.append(li);
      });
    }
  }

  //*** handler = function
  bindAddTodo(handler) {
    this.form.addEventListener("submit", event => {
      event.preventDefault();

      if (this._todoText) {
        handler(this._todoText);
        this._resetInput();
      }
    });
  }

  bindDeleteTodo(handler) {
    this.todoList.addEventListener("click", event => {
      if (event.target.className === "delete") {
        const id = parseInt(event.target.parentElement.id);

        handler(id);
      }
    });
  }

  bindToggleTodo(handler) {
    this.todoList.addEventListener("change", event => {
      if (event.target.type === "checkbox") {
        const id = parseInt(event.target.parentElement.id);

        handler(id);
      }
    });
  }
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;

    this.model.bindTodoListChanged(this.onTodoListChange);

    this.view.bindAddTodo(this.handleAddTodo);
    this.view.bindDeleteTodo(this.handleDeleteTodo);
    this.view.bindToggleTodo(this.handleToggleTodo);
    this.view.bindEditTodo(this.handleEditTodo);

    // Display initial todos
    this.onTodoListChange(this.model.todos);
  }

  onTodoListChange = todos => {
    this.view.displayTodos(todos);
  };

  handleAddTodo = todoText => {
    this.model.addTodo(todoText);
  };

  handleEditTodo = (id, updateText) => {
    this.model.editTodo(id, updateText);
  };

  handleDeleteTodo = id => {
    this.model.deleteTodo(id);
  };

  handleToggleTodo = id => {
    this.model.toggeTodo(id);
  };
}

const app = new Controller(new Model(), new View());

class Model {
  constructor() {
    this.todos = [
      { id: 1, text: "Run a marathon", completed: false },
      { id: 2, text: "Plant a garden", completed: false }
    ];
  }

  addTodo(todoText) {
    const todo = {
      id: this.todos.length > 0 ? this.todos[this.todos.length - 1].id + 1 : 1,
      text: todoText,
      completed: false
    };
    this.todos.push(todo);
  }

  editTodo(id, updateText) {
    this.todos = this.todos.map(todo =>
      todo.id === id
        ? { id: todo.id, text: updateText, complete: todo.complete }
        : tod
    );
  }

  deleteTod(id) {
    this.todos = this.todos.filter(todo => todo.id !== id);
  }

  toggeTodo(id) {
    this.todos = this.todos.map(todo =>
      todo.id === id
        ? { id: todo.id, text: todo.text, completed: !todo.completed }
        : todo
    );
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

    this.input = this.getElement("input");
    this.todoList = this.getElement(".todo-list");
    this.submitBtn = this.getElement(".submit-btn");
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
}

class Controller {
  constructor(model, view) {
    this.model = model;
    this.view = view;
  }
}

const app = new Controller(new Model(), new View());

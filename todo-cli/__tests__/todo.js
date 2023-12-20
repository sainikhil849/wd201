// Import the todoList module
const todoList = require("../todo");

// Declare the todos variable
let todos;

// Set up the test suite
beforeEach(() => {
  // Initialize todos before each test
  todos = todoList();
});

// Main test suite for TodoList
describe("TodoList Test Suite", () => {
  // Test: Should add new todo
  test("Should add new todo", () => {
    // Get the initial count of todo items
    const todoItemsCount = todos.all.length;

    // Add a new todo
    todos.add({
      title: "Test todo 2",
      completed: false,
      dueDate: "2023-12-20",
    });

    // Expect the count to increase by 1 after adding a new todo
    expect(todos.all.length).toBe(todoItemsCount + 1);
  });

  // Test: Should mark a todo as complete
  test("Should mark a todo as complete", () => {
    // Add a new todo
    todos.add({
      title: "Test todo",
      completed: false,
      dueDate: "2023-12-20",
    });

    // Expect the initial completion status to be false
    expect(todos.all[0].completed).toBe(false);

    // Mark the todo as complete
    todos.markAsComplete(0);

    // Expect the completion status to be true after marking as complete
    expect(todos.all[0].completed).toBe(true);
  });

  // Test: Should retrieve overdue items
  test("Should retrieve overdue items", () => {
    // Get today's date
    const dateToday = new Date();
    const formattedDate = (d) => d.toISOString().split("T")[0];
    const yesterday = formattedDate(new Date(dateToday.setDate(dateToday.getDate() - 1)));

    // Get the initial count of overdue items
    const overDueTodoItemsCount = todos.overdue().length;

    // Add an overdue item
    const overdueAdd = {
      title: "Complete my assignment",
      dueDate: yesterday,
      completed: false,
    };
    todos.add(overdueAdd);

    // Expect the count of overdue items to increase by 1 after adding an overdue item
    expect(todos.overdue().length).toEqual(overDueTodoItemsCount + 1);
  });

  // Test: Should retrieve due today items
  test("Should retrieve due today items", () => {
    // Get today's date
    const dateToday = new Date();
    const formattedDate = (d) => d.toISOString().split("T")[0];
    const today = formattedDate(dateToday);

    // Get the initial count of due today items
    const DueTodayTodoItemsCount = todos.dueToday().length;

    // Add a due today item
    const todayAdd = {
      title: "Complete this milestone",
      dueDate: today,
      completed: false,
    };
    todos.add(todayAdd);

    // Expect the count of due today items to increase by 1 after adding a due today item
    expect(todos.dueToday().length).toEqual(DueTodayTodoItemsCount + 1);
  });

  // Test: Should retrieve due later items
  test("Should retrieve due later items", () => {
    // Get today's date
    const dateToday = new Date();
    const formattedDate = (d) => d.toISOString().split("T")[0];
    const tomorrow = formattedDate(new Date(dateToday.setDate(dateToday.getDate() + 1)));

    // Get the initial count of due later items
    const DueLaterTodoItemsCount = todos.dueLater().length;

    // Add a due later item
    const laterAdd = {
      title: "Prepare for sem exams",
      dueDate: tomorrow,
      completed: false,
    };
    todos.add(laterAdd);

    // Expect the count of due later items to increase by 1 after adding a due later item
    expect(todos.dueLater().length).toEqual(DueLaterTodoItemsCount + 1);
  });
});


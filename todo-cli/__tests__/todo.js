const todoList = require("../todo");
let todos;

// Setup: Initialize a new todo list before each test
beforeEach(() => {
  todos = todoList();
});

// Test Suite for TodoList functionality
describe("TodoList Test Suite", () => {
  // Test: Adding a new todo
  test("Should add new todo", () => {
    // Arrange: Get the initial count of todos
    const todoItemsCount = todos.all.length;

    // Act: Add a new todo
    todos.add({
      title: "Test todo 2",
      completed: false,
      dueDate: "2023-12-20",
    });

    // Assert: Check if the todo count increased
    expect(todos.all.length).toBe(todoItemsCount + 1);
  });

  // Test: Marking a todo as complete
  test("Should mark a todo as complete", () => {
    // Arrange: Add an incomplete todo
    todos.add({
      title: "Test todo",
      completed: false,
      dueDate: "2023-12-20",
    });

    // Act: Mark the todo as complete
    todos.markAsComplete(0);

    // Assert: Check if the todo is marked as complete
    expect(todos.all[0].completed).toBe(true);
  });

  // Test: Retrieving overdue items
  test("Should retrieve overdue items", () => {
    // Arrange: Add an overdue todo
    const dateToday = new Date();
    const yesterday = new Date(dateToday.setDate(dateToday.getDate() - 1));
    const overdueTodoItemsCount = todos.overdue().length;

    // Act: Add an overdue todo
    todos.add({
      title: "Complete my assignment",
      dueDate: yesterday.toISOString().split("T")[0],
      completed: false,
    });

    // Assert: Check if the overdue todo is retrieved
    expect(todos.overdue().length).toEqual(overdueTodoItemsCount + 1);
  });

  // Test: Retrieving due today items
  test("Should retrieve due today items", () => {
    // Arrange: Add a todo due today
    const dateToday = new Date();
    const today = dateToday.toISOString().split("T")[0];
    const dueTodayTodoItemsCount = todos.dueToday().length;

    // Act: Add a todo due today
    todos.add({
      title: "Complete this milestone",
      dueDate: today,
      completed: false,
    });

    // Assert: Check if the todo due today is retrieved
    expect(todos.dueToday().length).toEqual(dueTodayTodoItemsCount + 1);
  });

  // Test: Retrieving due later items
  test("Should retrieve due later items", () => {
    // Arrange: Add a todo due later
    const dateToday = new Date();
    const tomorrow = new Date(dateToday.setDate(dateToday.getDate() + 1));
    const dueLaterTodoItemsCount = todos.dueLater().length;

    // Act: Add a todo due later
    todos.add({
      title: "Prepare for sem exams",
      dueDate: tomorrow.toISOString().split("T")[0],
      completed: false,
    });

    // Assert: Check if the todo due later is retrieved
    expect(todos.dueLater().length).toEqual(dueLaterTodoItemsCount + 1);
  });
});


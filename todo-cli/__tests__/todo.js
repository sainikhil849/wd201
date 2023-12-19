const myDatabase = require("../models");
const calculateDueDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error("Days must be an integer");
  }
  const currentDate = new Date();
  const oneDay = 86400000;
  return new Date(currentDate.getTime() + days * oneDay);
};

describe("Tests for functions in todo.js", function () {
  beforeAll(async () => {
    await myDatabase.sequelize.sync({ force: true });
  });

  test("Todo.overdue should return all tasks (including completed ones) that are past their due date", async () => {
    const todo = await myDatabase.Todo.addTask({
      title: "Sample Task",
      dueDate: calculateDueDate(-2),
      completed: false,
    });
    const items = await myDatabase.Todo.overdue();
    expect(items.length).toBe(1);
  });

  test("Todo.dueToday should return all tasks that are due today (including completed ones)", async () => {
    const dueTodayItems = await myDatabase.Todo.dueToday();
    const todo = await myDatabase.Todo.addTask({
      title: "Sample Task",
      dueDate: calculateDueDate(0),
      completed: false,
    });
    const items = await myDatabase.Todo.dueToday();
    expect(items.length).toBe(dueTodayItems.length + 1);
  });

  // ... (similar modifications for other test cases)

  test("For a complete todo due today, Todo.displayableString should return a string of the format `ID. [x] TITLE` (date should not be shown)", async () => {
    const dueTodayItems = await myDatabase.Todo.dueToday();
    const aTodo = dueTodayItems[0];
    expect(aTodo.completed).toBe(false);
    await myDatabase.Todo.markAsComplete(aTodo.id);
    await aTodo.reload();
    const displayValue = aTodo.displayableString();
    expect(displayValue).toBe(`${aTodo.id}. [x] ${aTodo.title}`);
  });
});

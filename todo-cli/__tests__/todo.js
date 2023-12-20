/* eslint-disable no-unused-vars */
// __tests__/todo.test.js
/* eslint-disable no-undef */

const db = require('../models')

const getJSDate = (days) => {
  if (!Number.isInteger(days)) {
    throw new Error('Need to pass an integer as days')
  }
  const today = new Date()
  const oneDay = 60 * 60 * 24 * 1000
  return new Date(today.getTime() + days * oneDay)
}

describe('Tests for functions in todo.js', () => {
  beforeAll(async () => {
    await db.sequelize.sync({ force: true })
  })

  test('Todo.addTask should add a new task and increase the count', async () => {
    const initialCount = await db.Todo.count()
    await db.Todo.addTask({
      title: 'New Task',
      dueDate: getJSDate(2),
      completed: false
    })
    const finalCount = await db.Todo.count()
    expect(finalCount).toBe(initialCount + 1)
  })

  test('Todo.markAsComplete should mark a task as complete', async () => {
    const task = await db.Todo.addTask({
      title: 'Incomplete Task',
      dueDate: getJSDate(2),
      completed: false
    })
    expect(task.completed).toBe(false)
    await db.Todo.markAsComplete(task.id)
    await task.reload()
    expect(task.completed).toBe(true)
  })

  test('Todo.overdue should return overdue tasks (including completed ones)', async () => {
    await db.Todo.addTask({
      title: 'Overdue Task',
      dueDate: getJSDate(-2),
      completed: false
    })
    const overdueTasks = await db.Todo.overdue()
    expect(overdueTasks.length).toBe(1)
  })

  test('Todo.dueToday should return tasks due today (including completed ones)', async () => {
    await db.Todo.addTask({
      title: 'Due Today Task',
      dueDate: getJSDate(0),
      completed: false
    })
    const dueTodayTasks = await db.Todo.dueToday()
    expect(dueTodayTasks.length).toBe(1)
  })

  test('Todo.dueLater should return tasks due on a future date (including completed ones)', async () => {
    await db.Todo.addTask({
      title: 'Due Later Task',
      dueDate: getJSDate(2),
      completed: false
    })
    const dueLaterTasks = await db.Todo.dueLater()
    expect(dueLaterTasks.length).toBe(1)
  })
 
  // Add more test cases as needed
})

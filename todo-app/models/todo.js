"use strict";
const { Model, Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static async addTodo({ title, dueDate }) {
      return this.create({ title, dueDate, completed: false });
    }

    static async getOverdueTodos() {
      try {
        const allTodos = await Todo.findAll({
          where: {
            dueDate: { [Op.lt]: new Date() },
            completed: { [Op.ne]: true },
          },
        });
        return allTodos;
      } catch (error) {
        console.error("Error getting overdue todos:", error);
        throw error;
      }
    }

    // ... (similar changes in other methods)

    async setCompletionStatus(status) {
      try {
        return await this.update({ completed: status });
      } catch (error) {
        console.error("Error updating completion status:", error);
        throw error;
      }
    }

    async markAsComplete() {
      try {
        return await this.update({ completed: true });
      } catch (error) {
        console.error("Error marking as complete:", error);
        throw error;
      }
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      completed: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );

  return Todo;
};


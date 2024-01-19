"use strict";

const { Model } = require("sequelize");
const { Op } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Todo extends Model {
    static associate(models) {
      Todo.belongsTo(models.User, {
        foreignKey: 'userId'
      });
    }

    static addTask({ title, dueDate, userId }) {
      return this.create({ title, dueDate, isCompleted: false, userId });
    }

    static async fetchTasks() {
      return await this.findAll();
    }

    updateCompletionStatus(status) {
      return this.update({ isCompleted: status });
    }

    static async getCompletedTasks(userId) {
      return await this.findAll({
        where: {
          isCompleted: true,
          userId
        },
      });
    }

    static async deleteTask(id) {
      return this.destroy({
        where: {
          id,
        },
      });
    }

    static async findOverdueTasks(userId) {
      const currentDate = new Date();
      return await this.findAll({
        where: {
          dueDate: {
            [Op.lt]: currentDate,
          },
          userId,
          isCompleted: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async findTasksDueToday(userId) {
      const currentDate = new Date();
      const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      return await this.findAll({
        where: {
          dueDate: {
            [Op.gte]: today,
            [Op.lt]: tomorrow,
          },
          userId,
          isCompleted: false,
        },
        order: [["id", "ASC"]],
      });
    }

    static async findTasksDueLater(userId) {
      return await this.findAll({
        where: {
          dueDate: {
            [Op.gt]: new Date(),
          },
          userId,
          isCompleted: false,
        },
        order: [["id", "ASC"]],
      });
    }
  }

  Todo.init(
    {
      title: DataTypes.STRING,
      dueDate: DataTypes.DATEONLY,
      isCompleted: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "Todo",
    }
  );
  return Todo;
};

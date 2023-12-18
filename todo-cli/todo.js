const todoList = () => {
    const all = [];
  
    const add = (todoItem) => {
      all.push(todoItem);
    };
  
    const markAsComplete = (index) => {
      if (index >= 0 && index < all.length) {
        all[index].completed = true;
      }
    };
  
    const overdue = () => {
      const currentDate = new Date().toISOString().split("T")[0];
      return all.filter((item) => item.dueDate < currentDate);
    };
  
    const dueToday = () => {
      const currentDate = new Date().toISOString().split("T")[0];
      return all.filter((item) => item.dueDate === currentDate);
    };
  
    const dueLater = () => {
      const currentDate = new Date().toISOString().split("T")[0];
      return all.filter((item) => item.dueDate > currentDate);
    };
  
    const toDisplayableList = () => {
      return all
        .map(
          (item) =>
            `${item.completed ? "[x]" : "[ ]"} ${item.title} ${
              item.dueDate === today ? "" : item.dueDate
            }`
        )
        .join("\n");
    };
  
    return {
      all,
      add,
      markAsComplete,
      overdue,
      dueToday,
      dueLater,
      toDisplayableList,
    };
  };
  
  // ####################################### #
  // DO NOT CHANGE ANYTHING BELOW THIS LINE. #
  // ####################################### #
  
  const todos = todoList();
  
  const formattedDate = (d) => {
    return d.toISOString().split("T")[0];
  };
  
  const dateToday = new Date();
  const today = formattedDate(dateToday);
  const yesterday = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() - 1))
  );
  const tomorrow = formattedDate(
    new Date(new Date().setDate(dateToday.getDate() + 1))
  );
  
  module.exports = todoList;
  

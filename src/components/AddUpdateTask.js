import React, { useState } from "react";
import "../form.scss";
const AddUpdateTask = ({ AddOrUpdateTask, taskToEdit }) => {
  //check if there is task to edit ? value of that task  or ""
  const [formData, setNewTask] = useState({
    id: taskToEdit ? taskToEdit.id : "",
    taskTitle: taskToEdit ? taskToEdit.taskTitle : "",
    task: taskToEdit ? taskToEdit.task : "",
  });

  const handleChange = (e) =>
    setNewTask({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    let action = ""; //action variable that we gonna use to tell the function in the app.js if we gonna add or update
    e.preventDefault();
    if (taskToEdit) {
      action = "edit";
    } else {
      action = "add";
    }
    AddOrUpdateTask(formData, action);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        name="taskTitle"
        className="input_text"
        placeholder="Task title"
        value={formData.taskTitle}
        onChange={handleChange}
        required
      />
      <br />
      <textarea
        name="task"
        value={formData.task}
        rows="5"
        cols="33"
        placeholder="write your task ..."
        onChange={handleChange}
      />
      <br />
      <input
        type="submit"
        value={taskToEdit ? "update task " : "add Task "}
        className="btn-add-car"
      />
    </form>
  );
};

export default AddUpdateTask;

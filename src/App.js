import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Modal } from "react-responsive-modal";
import AddUpdateTask from "./components/AddUpdateTask";
import "./App.scss";
import "react-responsive-modal/styles.css";

const task = {
  id: String(Math.random()),
  taskTitle: "cleaning",
  task: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ",
};

const task2 = {
  id: String(Math.random()),
  taskTitle: "washing",
  task: "Wash the car",
};

const list = {
  todo: {
    title: "Todo",
    items: [task, task2],
  },
  "in-progress": {
    title: "In Progress",
    items: [],
  },
  done: {
    title: "Completed",
    items: [],
  },
};
function App() {
  const [state, setState] = useState(list); //global state
  const [showModal, setShowModal] = useState(false); //to popup the modal
  const [taskToEdit, SetEditTask] = useState(null); //task to edit
  const [keyToUpdate, setKey] = useState(""); //key of the task in the list  that we gonna edit exemple["todo","in-progress","done"]

  const handleDragEnd = ({ destination, source }) => {
    //if destination of the task is  outside the target
    if (!destination) {
      return;
    }
    //if the distination and the soure of the task  is in the same place
    if (
      destination.index === source.index &&
      destination.droppableId === source.droppableId
    ) {
      return;
    }
    // Creating a copy of item before removing it from state list
    const itemCopy = { ...state[source.droppableId].items[source.index] };

    setState((prev) => {
      prev = { ...prev };
      // Remove item from the prev place
      prev[source.droppableId].items.splice(source.index, 1);

      // Adding item to the new array
      prev[destination.droppableId].items.splice(
        destination.index,
        0,
        itemCopy
      );

      return prev;
    });
  };

  //function that delete task from items array
  const handleDelete = (id, key) => {
    setState((prev) => {
      return {
        ...prev,
        [key]: {
          title: prev[key].title,
          items: prev[key].items.filter((el) => el.id !== id),
        },
      };
    });
  };

  //function that control if we gonna add or update task
  const AddOrUpdateTask = (task, action) => {
    if (action === "add") {
      //action is a variable that we gonna tell the function if we gonna add or update
      const newTask = {
        ...task,
        id: String(Math.random()),
      };
      console.log("to add", newTask);
      setState((prev) => {
        return {
          ...prev,
          todo: {
            title: "Todo",
            items: [newTask, ...prev.todo.items],
          },
        };
      });
    } else {
      setState((prev) => {
        return {
          ...prev,
          [keyToUpdate]: {
            title: prev[keyToUpdate].title,
            items: prev[keyToUpdate].items.map((el) =>
              el.id === task.id ? task : el
            ),
          },
        };
      });
    }
    SetEditTask(null);
    setShowModal(false);
  };

  //open modal for edit
  const OpenModalandEDIT = (task, key) => {
    SetEditTask(task);
    setKey(key);
    setShowModal(true);
    console.log("task to edit", taskToEdit);
  };

  //close the modal
  const onCloseModal = () => {
    SetEditTask(null);
    setShowModal(false);
  };
  return (
    <div className="container">
      <div className="navbar">
        <h3>SCRUMDASH</h3>
        <button onClick={() => setShowModal(true)}>
          <i className="fas fa-plus"></i>Add new Task
        </button>
      </div>
      <div className="list-task">
        <DragDropContext onDragEnd={handleDragEnd}>
          {Object.keys(state).map((key, index) => {
            return (
              <div key={key} className="column">
                <h2>{state[key].title}</h2>
                <Droppable droppableId={key}>
                  {(provided) => {
                    return (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="droppable-col"
                      >
                        {state[key].items.map((el, index) => {
                          return (
                            <Draggable
                              key={el.id}
                              index={index}
                              draggableId={el.id}
                            >
                              {(provided) => {
                                return (
                                  <div
                                    className="task"
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                  >
                                    <div className="task-header">
                                      <h3>{el.taskTitle}</h3>
                                      <span>0{index + 1}</span>
                                    </div>
                                    <p className="task-description">
                                      {el.task}
                                    </p>
                                    <button
                                      onClick={() => OpenModalandEDIT(el, key)}
                                    >
                                      <i className="fas fa-pen-alt"></i>edit
                                    </button>
                                    <button
                                      onClick={() => handleDelete(el.id, key)}
                                    >
                                      <i className="fas fa-trash-alt"></i>delete
                                    </button>
                                  </div>
                                );
                              }}
                            </Draggable>
                          );
                        })}
                        {provided.placeholder}
                      </div>
                    );
                  }}
                </Droppable>
              </div>
            );
          })}
        </DragDropContext>
      </div>
      <Modal open={showModal} onClose={onCloseModal} center>
        <AddUpdateTask
          AddOrUpdateTask={AddOrUpdateTask}
          taskToEdit={taskToEdit}
        />
      </Modal>
    </div>
  );
}

export default App;

import { useState, useEffect } from "react";

const days = [
  "ორშაბათი",
  "სამშაბათი",
  "ოთხშაბათი",
  "ხუთშაბათი",
  "პარასკევი",
  "შაბათი",
  "კვირა",
];

function Button({ children, onClick, type = "button" }) {
  return (
    <button type={type} className="button" onClick={onClick}>
      {children}
    </button>
  );
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [showAddTask, setShowAddTask] = useState(false);

  useEffect(() => {
    const storedTasks = localStorage.getItem("tasks");
    if (storedTasks) {
      setTasks(JSON.parse(storedTasks));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  function handleAddTask(task) {
    setTasks((tasks) => [...tasks, task]);
  }

  function handleShowAddTask() {
    setShowAddTask((prevShow) => !prevShow);
  }

  function handleClearTasks() {
    setTasks([]);
  }

  function handleSortTasks() {
    setTasks((tasks) =>
      [...tasks].sort((a, b) => days.indexOf(a.day) - days.indexOf(b.day))
    );
  }

  function handleDeleteTaks(taskToDelete) {
    setTasks(tasks.filter((task) => task.id !== taskToDelete.id));
  }

  return (
    <div>
      <div className="container">
        <TaskList tasks={tasks} onSelectTasks={handleDeleteTaks} />
        {showAddTask && (
          <AddNewTask
            onAddTask={handleAddTask}
            onShowAddTask={handleShowAddTask}
          />
        )}
      </div>
      <div className="test">
        <Button onClick={handleShowAddTask}>დაამატე ახალი</Button>
        <Button onClick={handleSortTasks}>დაალაგე</Button>
        <Button onClick={handleClearTasks}>გაასუფთავე</Button>
      </div>
    </div>
  );
}

function TaskList({ tasks, onSelectTasks }) {
  return (
    <div className="list">
      <h1>ჩაიწერე, რომ არ დაგავიწყდეს!</h1>
      {tasks.length > 0 ? (
        <ul>
          {tasks.map((task) => (
            <Task key={task.id} task={task} onSelectTasks={onSelectTasks} />
          ))}
        </ul>
      ) : (
        <h1 className="begining">არ გაქვთ აქტიური Task, გთხოვთ დაამატოთ </h1>
      )}
    </div>
  );
}

function Task({ task, onSelectTasks }) {
  const [isChecked, setIsChecked] = useState(false);

  function handleIsChecked() {
    setIsChecked((checked) => !checked);
  }

  return (
    <li className="task">
      <div className="textDiv">
        <h3> {task.day}</h3>
        <div className="buttonDiv">
          {!isChecked && (
            <div onClick={handleIsChecked}>
              <i className="bx bxs-check-circle"></i>
            </div>
          )}
          <div onClick={() => onSelectTasks(task)}>
            <i className="bx bxs-x-circle"></i>
          </div>
        </div>
      </div>
      <p className={isChecked ? "done" : ""}>{`${task.text}`}</p>
    </li>
  );
}

function AddNewTask({ onAddTask, onShowAddTask }) {
  const [newTask, setNewTask] = useState("");
  const [newDay, setNewDay] = useState("ორშაბათი");

  function handleSubmit(e) {
    e.preventDefault();

    if (!newTask || !newDay) return;

    const id = crypto.randomUUID();
    const task = {
      id,
      day: newDay,
      text: newTask,
    };

    onAddTask(task);

    // Reset the input values
    setNewTask("");
    setNewDay("");

    // Optionally, close the modal after submission
    onShowAddTask();
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <i className="bx bx-x" onClick={onShowAddTask}></i>
        <form className="form" onSubmit={handleSubmit}>
          <h3>დაამატე Task</h3>

          <label>აირჩიე დღე</label>

          <select value={newDay} onChange={(e) => setNewDay(e.target.value)}>
            <option>ორშაბათი</option>
            <option>სამშაბათი</option>
            <option>ოთხშაბათი</option>
            <option>ხუთშაბათი</option>
            <option>პარასკევი</option>
            <option>შაბათი</option>
            <option>კვირა</option>
          </select>
          <label>გასაკეთებელი</label>
          <input
            className="formText"
            type="text"
            placeholder="ჩაწერე საქმე"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />

          <Button type="submit">შეინახე</Button>
        </form>
      </div>
    </div>
  );
}

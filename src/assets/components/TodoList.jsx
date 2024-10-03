import React, { useState, useEffect } from "react";

export default function TodoList() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editIndex, setEditIndex] = useState(null);
  const [filter, setFilter] = useState("all");
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const storedTodos = JSON.parse(localStorage.getItem("todos") || "[]");
    setTodos(storedTodos);
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const handleInput = (e) => {
    setNewTodo(e.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      if (editIndex !== null) {
        const updatedTodos = todos.map((todo, index) =>
          index === editIndex ? { ...todo, text: newTodo } : todo
        );
        setTodos(updatedTodos);
        setEditIndex(null);
      } else {
        const newTodos = [...todos, { text: newTodo, completed: false }];
        setTodos(newTodos);
      }
      setNewTodo("");
      localStorage.setItem("todos", JSON.stringify(todos));
    }
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      handleAddTodo();
    }
  };

  const handleRemoveTodo = (index) => {
    const updatedTodos = todos.filter((_, i) => i !== index);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleToggleComplete = (index) => {
    const updatedTodos = todos.map((todo, i) =>
      i === index ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
  };

  const handleEditTodo = (index) => {
    setEditIndex(index);
    setNewTodo(todos[index].text);
  };

  const handleMoveUp = (index) => {
    if (index > 0) {
      const newTodos = [...todos];
      [newTodos[index - 1], newTodos[index]] = [
        newTodos[index],
        newTodos[index - 1],
      ];
      setTodos(newTodos);
      localStorage.setItem("todos", JSON.stringify(newTodos));
    }
  };

  const handleMoveDown = (index) => {
    if (index < todos.length - 1) {
      const newTodos = [...todos];
      [newTodos[index], newTodos[index + 1]] = [
        newTodos[index + 1],
        newTodos[index],
      ];
      setTodos(newTodos);
      localStorage.setItem("todos", JSON.stringify(newTodos));
    }
  };

  const handleDragStart = (index) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;
    const newTodos = [...todos];
    const draggedTodo = newTodos[draggedItem];
    newTodos.splice(draggedItem, 1);
    newTodos.splice(index, 0, draggedTodo);
    setTodos(newTodos);
    setDraggedItem(index);
    localStorage.setItem("todos", JSON.stringify(newTodos));
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed;
    if (filter === "completed") return todo.completed;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
          Todo List
        </h1>

        <div className="flex mb-4">
          <input
            className="flex-grow mr-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            type="text"
            placeholder="Add a new todo..."
            value={newTodo}
            onChange={handleInput}
            onKeyDown={handleKey}
          />
          <button
            className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-r-lg hover:from-blue-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all duration-200"
            onClick={handleAddTodo}
          >
            {editIndex !== null ? "Update" : "Add"}
          </button>
        </div>

        <div className="flex justify-center space-x-4 mb-4">
          {["all", "active", "completed"].map((f) => (
            <button
              key={f}
              className={`px-3 py-1 rounded-full text-sm ${
                filter === f
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              } transition-all duration-200`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        <ul className="space-y-2">
          {filteredTodos.map((todo, index) => (
            <li
              key={index}
              className="bg-gray-50 rounded-lg p-3 flex items-center justify-between transition-all duration-300 hover:shadow-md cursor-move"
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center flex-grow mr-2">
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => handleToggleComplete(index)}
                  className="mr-3 form-checkbox h-5 w-5 text-blue-500 rounded focus:ring-blue-400"
                />
                <span
                  className={`font-medium ${
                    todo.completed
                      ? "line-through text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {todo.text}
                </span>
              </div>
              <div className="flex space-x-2">
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  aria-label="Move todo up"
                >
                  ⬆️
                </button>
                <button
                  className="text-gray-500 hover:text-gray-700"
                  onClick={() => handleMoveDown(index)}
                  disabled={index === todos.length - 1}
                  aria-label="Move todo down"
                >
                  ⬇️
                </button>
                <button
                  className="text-blue-500 hover:text-blue-600"
                  onClick={() => handleEditTodo(index)}
                  aria-label="Edit todo"
                >
                  ✏️
                </button>
                <button
                  className="text-red-500 hover:text-red-600"
                  onClick={() => handleRemoveTodo(index)}
                  aria-label="Remove todo"
                >
                  🗑️
                </button>
              </div>
            </li>
          ))}
        </ul>

        {todos.length === 0 && (
          <p className="text-gray-500 text-center mt-4">No todos yet! 👀</p>
        )}
      </div>
    </div>
  );
}

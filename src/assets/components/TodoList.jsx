import { useEffect, useState } from "react";

const TodoList = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [NoTodosMessage, setNoTodosMessage] = useState(true);

  const handleInput = (e) => {
    setNewTodo(e.target.value);
  };

  const handleAddTodo = () => {
    if (newTodo.trim() !== "") {
      setTodos((t) => [...t, newTodo]);
      setNewTodo("");
      setNoTodosMessage(false);
    }
  };

  const handleRemoveTodo = (index) => {
    setTodos((t) => t.filter((_, i) => i !== index));

    if(index === 0){
      setNoTodosMessage(true);
    }
  };

  const handlePushUp = (index) => {
    if (index > 0) {
      const UpdatedTodo = [...todos];

      [UpdatedTodo[index], UpdatedTodo[index - 1]] = [
        UpdatedTodo[index - 1],
        UpdatedTodo[index],
      ];

      setTodos(UpdatedTodo);
    }
  };

  const handlePushDown = (index) => {
    if (index < todos.length - 1) {
      const UpdatedTodo = [...todos];

      [UpdatedTodo[index], UpdatedTodo[index + 1]] = [
        UpdatedTodo[index + 1],
        UpdatedTodo[index],
      ];

      setTodos(UpdatedTodo);
    }
  };

  return (
    <>
      <div className=" mt-28 flex flex-col items-center mx-auto w-5/12">
        <div>
          <h1 className=" text-red-600 text-7xl font-bold ">
            Todo List <span className=" text-gray-600 text-7xl ">ReactJS</span>
          </h1>

          <div className="flex items-center mt-20">
            <input
              className=" bg-neutral-300 w-full h-6 px-5 py-6 text-md font-medium rounded-l-2xl border-4 border-slate-600 focus:outline-none transition-all placeholder-font-semibold placeholder-gray-600"
              type="text"
              placeholder="Enter the Todo"
              value={newTodo}
              onChange={handleInput}
            />

            <button
              className=" text-neutral-300 bg-slate-600 hover:bg-slate-800 h-14 font-medium rounded-r-2xl px-5 py-2.5 transition-all text-sm"
              onClick={handleAddTodo}
            >
              Add Todo
            </button>
          </div>

          <h1 className="text-gray-400 my-10 font-bold text-4xl items-start">
            List
          </h1>

          {NoTodosMessage && <p className=" text-zinc-400 text-xl">" No todos yet! 👀"</p>}

          <ol className="flex flex-1 flex-col mt-5">
            {todos.map((todo, index) => (
              <>
                <div className="bg-neutral-300 flex flex-row justify-between mb-5 rounded-md min-w-96">
                  <li key={index} className="font-medium m-2 px-5 py-1">
                    {todo}
                  </li>
                  <div className="flex flex-row ">
                    <button
                      className=" bg-zinc-500 px-5 py-1 text-lg"
                      onClick={() => handlePushUp(index)}
                    >
                      👆
                    </button>
                    <button
                      className="bg-zinc-500  px-5 py-1 text-lg"
                      onClick={() => handlePushDown(index)}
                    >
                      👇
                    </button>
                    <button
                      className=" bg-red-700 hover:bg-red-900 rounded-r px-5 py-1 text-neutral-300 font-semibold"
                      onClick={() => handleRemoveTodo(index)}
                    >
                      remove
                    </button>
                  </div>
                </div>
              </>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
};

export default TodoList;

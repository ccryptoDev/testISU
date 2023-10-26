import { useState, useEffect } from "react";

const BASE_URL = "https://localhost:7282/api/todos";

interface Todo {
  id: string;
  text: string;
  priority: number;
}

const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState<string>("");
  const [priority, setPriority] = useState<number>(1);

  // Fetch todos from the backend (you can provide a mock API endpoint)
  useEffect(() => {
    // Implement API call to fetch todos from the .NET Core backend here
    fetch(BASE_URL)
      .then((response) => response.json())
      .then((data) => setTodos(data))
      .catch((error) => console.error("Error fetching todos:", error));
  }, []);

  const addTodo = () => {
    // Implement the logic to add a new to-do item here
    if (newTodo.trim() === "") {
      return; // Don't add empty todos
    }

    const newTodoItem: Todo = {
      id: String(Date.now()), // Generate a unique ID (you can use a UUID library)
      text: newTodo,
      priority: priority, // Assign the selected priority
    };

    setTodos((prevTodos) => [...prevTodos, newTodoItem]); // Update state optimistically

    // Make an API call to save the new to-do item on the server
    fetch(BASE_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newTodoItem),
    })
      .then((response) => response.json())
      .then((data) => {
        // Update state with the saved item from the server, including its ID
        setTodos((prevTodos) => prevTodos.map((todo) => (todo.id === newTodoItem.id ? data : todo)));
      })
      .catch((error) => console.error("Error adding todo:", error));

    setNewTodo(""); // Clear the input field
  };

  const deleteTodo = (id: string) => {
    // Implement the logic to delete a to-do item here
    const deletedTodo = todos.find((todo) => todo.id === id);

    if (deletedTodo) {
      // Make an API call to delete the to-do item on the server
      fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
      })
        .then(() => {
          setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
        })
        .catch((error) => console.error("Error deleting todo:", error));
    }
  };

  // Render the list of todos and the input field for adding new todos

  return (
    <div>
      <h1>To-Do List</h1>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="Add a new task"
      />
      <select onChange={(e) => setPriority(parseInt(e.target.value))}>
        <option value="1">Low</option>
        <option value="2">Medium</option>
        <option value="3">High</option>
      </select>
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {`${todo.text} (Priority: ${todo.priority})`}
            <button onClick={() => deleteTodo(todo.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;

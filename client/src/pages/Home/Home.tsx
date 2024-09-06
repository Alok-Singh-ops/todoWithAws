import { useEffect, useState } from "react";

interface ITodo {
  id: number;
  title: string;
  description: string;
  isDone: boolean;
}

const Home = () => {
  const token = localStorage.getItem("token");
  const [profilePhoto, setProfilePhoto] = useState<string>();
  const [todos, setTodos] = useState<ITodo[]>([]);

  useEffect(() => {
    setProfilePhoto(localStorage.getItem("profilePhoto") || "");

    const getTodo = async () => {
      try {
        const response = await fetch("http://localhost:8080/todo/getTodo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        console.log(error);
      }
    };
    if (!token) {
      window.location.href = "/login";
    }
    getTodo();
  }, [token]);

  const handleCheckboxChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    todoId: number
  ) => {
    const isChecked = e.target.checked;
    try {
      const response = await fetch("http://localhost:8080/todo/updateTodo", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: todoId,
          isDone: isChecked,
        }),
      });
      await response.json();

      // Update the specific todo in the state
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo.id === todoId ? { ...todo, isDone: isChecked } : todo
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async () => {};

  return (
    <div>
      <img
        src={profilePhoto}
        alt="Profile"
        style={{ width: "50px", height: "50px" }}
      />
      {todos.map((todo: ITodo) => (
        <div key={todo.id}>
          <input
            type="checkbox"
            checked={todo.isDone}
            onChange={(e) => handleCheckboxChange(e, todo.id)}
          />
          <span>{todo.title}</span> <span>{todo.description}</span>
          <button onClick={handleDelete}>Delete</button>
        </div>
      ))}
    </div>
  );
};

export default Home;

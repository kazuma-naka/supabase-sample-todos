"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

type Todo = {
  id: string;
  task: string;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const fetchTodos = async () => {
      const { data, error } = await supabase.from("todos").select("*");
      if (error) console.error("Error fetching todos:", error.message);
      else setTodos(data || []);
    };
    console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    fetchTodos();
  }, []);

  return (
    <div>
      <h1>Todos</h1>
      <ul>
        {todos.map((todo: Todo) => (
          <li key={todo.id}>key={todo.id} task={todo.task}</li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import styles from '../styles/Home.module.css';

interface Todo {
  id: string;
  task: string;
  is_complete: boolean;
  created_at: string;
}

export default function Page() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setTodos(data || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    }
  };

const addTodo = async () => {
    if (!newTask.trim()) return;
  
    try {
      const { data, error } = await supabase
        .from('todos')
        .insert([{ task: newTask }])
        .select('*');
  
      if (error) throw error;
  
      setTodos((prev) => [...prev, ...(data || [])]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding todo:', error);
    }
  };
  
  const resetTable = async () => {
    setLoading(true);
    try {
      const response = await fetch('../api/resetTable', { method: 'POST' });
      const result = await response.json();

      if (result.error) {
        console.error(result.message);
        return;
      }

      console.log(result.message);
      fetchTodos();
    } catch (error) {
      console.error('Error resetting table:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1>Todo App</h1>
      <button onClick={resetTable} disabled={loading}>
        {loading ? 'Resetting...' : 'Reset Table'}
      </button>
      <div>
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a task"
        />
        <button onClick={addTodo}>Add Task</button>
      </div>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.task} {todo.is_complete ? '✅' : ''}
          </li>
        ))}
      </ul>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '../../lib/supabaseClient';
import styles from '../../styles/Home.module.css';

export default function EditPage() {
  const router = useRouter();
  const { id } = router.query as { id: string }; // Explicitly type `id` as string
  const [task, setTask] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchTask();
    }
  }, [id]);

  const fetchTask = async () => {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('task')
        .eq('id', id)
        .single();

      if (error) throw error;
      setTask(data?.task || '');
    } catch (error) {
      console.error('Error fetching task:', error);
    }
  };

  const updateTask = async () => {
    if (!task.trim()) return;
    setLoading(true);
    try {
      const { error } = await supabase.from('todos').update({ task }).eq('id', id);
      if (error) throw error;
      router.push('/'); // Redirect to the main page
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit Task</h1>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        className={styles.input}
        placeholder="Edit your task"
      />
      <div className={styles.buttonContainer}>
        <button onClick={updateTask} className={styles.button} disabled={loading}>
          {loading ? 'Updating...' : 'Update'}
        </button>
        <button onClick={() => router.push('/')} className={styles.button}>
          Cancel
        </button>
      </div>
    </div>
  );
}

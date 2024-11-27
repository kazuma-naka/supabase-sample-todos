import { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../lib/supabaseClient';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: true, message: 'Method Not Allowed' });
  }

  try {
    const { error } = await supabase
      .from('todos')
      .delete()
      .not('task', 'is', null);

    if (error) throw error;

    return res.status(200).json({ error: false, message: 'All tasks deleted successfully' });
  } catch (err) {
    console.error('Error deleting all tasks:', err);
    return res.status(500).json({ error: true, message: 'Error deleting all tasks' });
  }
}

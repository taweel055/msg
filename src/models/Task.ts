import { v4 as uuidv4 } from 'uuid';
import { dbAsync } from '../database/init';

export interface Task {
  id: string;
  title: string;
  description?: string;
  screenshot_id?: string;
  group_id?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high';
  due_date?: string;
  created_at: string;
  completed_at?: string;
}

export class TaskModel {
  static async create(data: {
    title: string;
    description?: string;
    screenshot_id?: string;
    group_id?: string;
    status?: string;
    priority?: string;
    due_date?: string;
  }): Promise<Task> {
    const id = uuidv4();

    await dbAsync.run(
      `INSERT INTO tasks (id, title, description, screenshot_id, group_id, status, priority, due_date)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.title,
        data.description || null,
        data.screenshot_id || null,
        data.group_id || null,
        data.status || 'pending',
        data.priority || 'medium',
        data.due_date || null,
      ]
    );

    return this.findById(id) as Promise<Task>;
  }

  static async findById(id: string): Promise<Task | null> {
    const result = await dbAsync.get<Task>('SELECT * FROM tasks WHERE id = ?', [id]);
    return result || null;
  }

  static async findAll(): Promise<Task[]> {
    const results = await dbAsync.all<Task>('SELECT * FROM tasks ORDER BY created_at DESC');
    return results;
  }

  static async findByScreenshotId(screenshotId: string): Promise<Task[]> {
    const results = await dbAsync.all<Task>(
      'SELECT * FROM tasks WHERE screenshot_id = ? ORDER BY created_at DESC',
      [screenshotId]
    );
    return results;
  }

  static async findByGroupId(groupId: string): Promise<Task[]> {
    const results = await dbAsync.all<Task>(
      'SELECT * FROM tasks WHERE group_id = ? ORDER BY created_at DESC',
      [groupId]
    );
    return results;
  }

  static async update(id: string, data: Partial<Task>): Promise<void> {
    const fields = Object.keys(data)
      .filter((key) => key !== 'id' && key !== 'created_at')
      .map((key) => `${key} = ?`)
      .join(', ');

    const values = Object.keys(data)
      .filter((key) => key !== 'id' && key !== 'created_at')
      .map((key) => data[key as keyof Task]);

    if (data.status === 'completed' && !data.completed_at) {
      await dbAsync.run(
        `UPDATE tasks SET ${fields}, completed_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [...values, id]
      );
    } else {
      await dbAsync.run(`UPDATE tasks SET ${fields} WHERE id = ?`, [...values, id]);
    }
  }

  static async delete(id: string): Promise<void> {
    await dbAsync.run('DELETE FROM tasks WHERE id = ?', [id]);
  }
}

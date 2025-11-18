import { v4 as uuidv4 } from 'uuid';
import { dbAsync } from '../database/init';

export interface Group {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created_at: string;
}

export class GroupModel {
  static async create(data: {
    name: string;
    description?: string;
    color?: string;
  }): Promise<Group> {
    const id = uuidv4();

    await dbAsync.run(
      `INSERT INTO groups (id, name, description, color)
       VALUES (?, ?, ?, ?)`,
      [id, data.name, data.description || null, data.color || null]
    );

    return this.findById(id) as Promise<Group>;
  }

  static async findById(id: string): Promise<Group | null> {
    const result = await dbAsync.get<Group>('SELECT * FROM groups WHERE id = ?', [id]);
    return result || null;
  }

  static async findAll(): Promise<Group[]> {
    const results = await dbAsync.all<Group>('SELECT * FROM groups ORDER BY created_at DESC');
    return results;
  }

  static async update(id: string, data: Partial<Group>): Promise<void> {
    const fields = Object.keys(data)
      .filter((key) => key !== 'id' && key !== 'created_at')
      .map((key) => `${key} = ?`)
      .join(', ');

    const values = Object.keys(data)
      .filter((key) => key !== 'id' && key !== 'created_at')
      .map((key) => data[key as keyof Group]);

    await dbAsync.run(`UPDATE groups SET ${fields} WHERE id = ?`, [...values, id]);
  }

  static async delete(id: string): Promise<void> {
    await dbAsync.run('DELETE FROM groups WHERE id = ?', [id]);
  }
}

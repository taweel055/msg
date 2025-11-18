import { v4 as uuidv4 } from 'uuid';
import { dbAsync } from '../database/init';

export interface Screenshot {
  id: string;
  filename: string;
  filepath: string;
  group_id?: string;
  ocr_provider: string;
  extracted_text?: string;
  summary?: string;
  created_at: string;
}

export class ScreenshotModel {
  static async create(data: {
    filename: string;
    filepath: string;
    group_id?: string;
    ocr_provider: string;
    extracted_text?: string;
    summary?: string;
  }): Promise<Screenshot> {
    const id = uuidv4();

    await dbAsync.run(
      `INSERT INTO screenshots (id, filename, filepath, group_id, ocr_provider, extracted_text, summary)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.filename,
        data.filepath,
        data.group_id || null,
        data.ocr_provider,
        data.extracted_text || null,
        data.summary || null,
      ]
    );

    return this.findById(id) as Promise<Screenshot>;
  }

  static async findById(id: string): Promise<Screenshot | null> {
    const result = await dbAsync.get('SELECT * FROM screenshots WHERE id = ?', [id]);
    return result || null;
  }

  static async findAll(): Promise<Screenshot[]> {
    const results = await dbAsync.all('SELECT * FROM screenshots ORDER BY created_at DESC');
    return results;
  }

  static async findByGroupId(groupId: string): Promise<Screenshot[]> {
    const results = await dbAsync.all(
      'SELECT * FROM screenshots WHERE group_id = ? ORDER BY created_at DESC',
      [groupId]
    );
    return results;
  }

  static async update(id: string, data: Partial<Screenshot>): Promise<void> {
    const fields = Object.keys(data)
      .filter((key) => key !== 'id' && key !== 'created_at')
      .map((key) => `${key} = ?`)
      .join(', ');

    const values = Object.keys(data)
      .filter((key) => key !== 'id' && key !== 'created_at')
      .map((key) => data[key as keyof Screenshot]);

    await dbAsync.run(`UPDATE screenshots SET ${fields} WHERE id = ?`, [...values, id]);
  }

  static async delete(id: string): Promise<void> {
    await dbAsync.run('DELETE FROM screenshots WHERE id = ?', [id]);
  }
}

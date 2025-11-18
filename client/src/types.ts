export interface Screenshot {
  id: string;
  filename: string;
  filepath: string;
  group_id?: string;
  content_type: 'screenshot' | 'chat';
  ocr_provider: 'claude' | 'deepseek';
  extracted_text?: string;
  summary?: string;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  color?: string;
  created_at: string;
}

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

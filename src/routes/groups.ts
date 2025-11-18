import express from 'express';
import { GroupModel } from '../models/Group';
import { ScreenshotModel } from '../models/Screenshot';
import { TaskModel } from '../models/Task';

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { name, description, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Group name is required' });
    }

    const group = await GroupModel.create({ name, description, color });

    res.status(201).json(group);
  } catch (error) {
    console.error('Create group error:', error);
    res.status(500).json({ error: 'Failed to create group' });
  }
});

router.get('/', async (req, res) => {
  try {
    const groups = await GroupModel.findAll();
    res.json(groups);
  } catch (error) {
    console.error('Get groups error:', error);
    res.status(500).json({ error: 'Failed to fetch groups' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const group = await GroupModel.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    console.error('Get group error:', error);
    res.status(500).json({ error: 'Failed to fetch group' });
  }
});

router.get('/:id/screenshots', async (req, res) => {
  try {
    const screenshots = await ScreenshotModel.findByGroupId(req.params.id);
    res.json(screenshots);
  } catch (error) {
    console.error('Get group screenshots error:', error);
    res.status(500).json({ error: 'Failed to fetch group screenshots' });
  }
});

router.get('/:id/tasks', async (req, res) => {
  try {
    const tasks = await TaskModel.findByGroupId(req.params.id);
    res.json(tasks);
  } catch (error) {
    console.error('Get group tasks error:', error);
    res.status(500).json({ error: 'Failed to fetch group tasks' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const group = await GroupModel.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    await GroupModel.update(req.params.id, req.body);

    const updated = await GroupModel.findById(req.params.id);
    res.json(updated);
  } catch (error) {
    console.error('Update group error:', error);
    res.status(500).json({ error: 'Failed to update group' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const group = await GroupModel.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ error: 'Group not found' });
    }

    await GroupModel.delete(req.params.id);

    res.json({ message: 'Group deleted successfully' });
  } catch (error) {
    console.error('Delete group error:', error);
    res.status(500).json({ error: 'Failed to delete group' });
  }
});

export default router;

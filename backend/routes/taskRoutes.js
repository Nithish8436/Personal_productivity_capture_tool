const express = require('express');
const router = express.Router();
const { getTasks, createTask, parseTask, updateTask, deleteTask, getSummary, decomposeExistingTask, getTaskSuggestions, searchTasks, getRelatedTasks } = require('../controllers/taskController');

const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/summary', getSummary);
router.get('/suggestions', getTaskSuggestions);
router.get('/search', searchTasks);
router.get('/:id/related', getRelatedTasks);
router.get('/', getTasks);
router.post('/', createTask);
router.post('/parse', parseTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/decompose', decomposeExistingTask);

module.exports = router;

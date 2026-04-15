const express = require('express');
const router = express.Router();
const { getTasks, createTask, parseTask, updateTask, deleteTask, getSummary, decomposeExistingTask, getTaskSuggestions } = require('../controllers/taskController');

router.get('/summary', getSummary);
router.get('/suggestions', getTaskSuggestions);
router.get('/', getTasks);
router.post('/', createTask);
router.post('/parse', parseTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);
router.post('/:id/decompose', decomposeExistingTask);

module.exports = router;

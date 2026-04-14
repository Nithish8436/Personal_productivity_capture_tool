const express = require('express');
const router = express.Router();
const { getTasks, createTask, parseTask, updateTask, deleteTask, getSummary } = require('../controllers/taskController');

router.get('/summary', getSummary);
router.get('/', getTasks);
router.post('/', createTask);
router.post('/parse', parseTask);
router.patch('/:id', updateTask);
router.delete('/:id', deleteTask);

module.exports = router;

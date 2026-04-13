const express = require('express');
const router = express.Router();
const { getTasks, createTask, parseTask } = require('../controllers/taskController');

router.get('/', getTasks);
router.post('/', createTask);
router.post('/parse', parseTask);

module.exports = router;

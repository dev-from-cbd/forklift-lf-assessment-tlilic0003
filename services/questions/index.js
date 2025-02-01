import express from 'express';
import cors from 'cors';
import { questions } from '../../src/data/questions.js';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3002;

app.get('/api/questions', (req, res) => {
  res.json(questions);
});

app.get('/api/questions/:id', (req, res) => {
  const question = questions.find(q => q.id === parseInt(req.params.id));
  if (question) {
    res.json(question);
  } else {
    res.status(404).json({ error: 'Question not found' });
  }
});

app.listen(PORT, () => {
  console.log(`Questions service running on port ${PORT}`);
});
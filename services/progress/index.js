import express from 'express';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3003;

const progress = new Map();

app.post('/api/progress/save', (req, res) => {
  const { userId, questionId, answers } = req.body;
  if (!progress.has(userId)) {
    progress.set(userId, new Map());
  }
  progress.get(userId).set(questionId, answers);
  res.json({ success: true });
});

app.get('/api/progress/:userId', (req, res) => {
  const userProgress = progress.get(req.params.userId) || new Map();
  res.json(Object.fromEntries(userProgress));
});

app.listen(PORT, () => {
  console.log(`Progress service running on port ${PORT}`);
});
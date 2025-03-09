import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.post('/api/auth/login', (req, res) => {
  // Simple authentication for demo
  const { username, password } = req.body;
  if (username && password) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET || 'secret');
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
import express from 'express';
import cors from 'cors';
import CryptoJS from 'crypto-js';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3002;

// Read encrypted questions from file
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const questionsPath = path.join(__dirname, '../../src/data/questions.ts');
const questionsFile = fs.readFileSync(questionsPath, 'utf8');

// Extract the encrypted questions string
const encryptedQuestionsMatch = questionsFile.match(/export const encryptedQuestions = ["'](.+)["']/);
const encryptedQuestions = encryptedQuestionsMatch ? encryptedQuestionsMatch[1] : '';

const ENCRYPTION_KEY = process.env.VITE_ENCRYPTION_KEY || 'default-key-123';

const decrypt = (encryptedData) => {
  const bytes = CryptoJS.AES.decrypt(encryptedData, ENCRYPTION_KEY);
  return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
};

app.get('/api/questions', (req, res) => {
  const questions = decrypt(encryptedQuestions);
  res.json(questions);
});

app.get('/api/questions/:id', (req, res) => {
  const questions = decrypt(encryptedQuestions);
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
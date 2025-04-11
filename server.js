require('dotenv').config();
const express = require('express');
const cors = require('cors');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Claude client
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY
});

// Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Generate practice questions
app.post('/api/generate-questions', async (req, res) => {
  try {
    const { subject, topic, difficulty } = req.body;
    
    const prompt = `Generate 5 practice questions for ${subject} on the topic of ${topic} at ${difficulty} difficulty level. 
    Format each question with:
    1. The question text
    2. Multiple choice options (A, B, C, D)
    3. The correct answer
    4. A brief explanation`;

    const response = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    });

    res.json({ questions: response.content[0].text });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({ error: 'Failed to generate questions' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
}); 
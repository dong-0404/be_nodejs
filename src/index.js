const express = require('express');
const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');
const fileRouter = require('./routes/file.routes');
const scheduleTelegramJob = require('./schedulers/telegram.scheduler');
const app = express();
const port = 3001;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api', userRouter);
app.use('/api/file', fileRouter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

scheduleTelegramJob();

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

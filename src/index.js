require('dotenv').config();
const express = require('express');
const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');
const fileRouter = require('./routes/file.routes');
const productRouter = require('./routes/product.routes');
const productImageRouter = require('./routes/productImage.routes');
const scheduleTelegramJob = require('./schedulers/telegram.scheduler');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api', userRouter);
app.use('/api/file', fileRouter);
app.use('/api', productRouter);
app.use('/api', productImageRouter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

scheduleTelegramJob();

app.listen(port, () => {
  console.log(`Local access: http://localhost:${port}`);
});

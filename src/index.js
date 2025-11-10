require('dotenv').config();
const express = require('express');
const cors = require('cors');
const userRouter = require('./routes/user.routes');
const authRouter = require('./routes/auth.routes');
const fileRouter = require('./routes/file.routes');
const productRouter = require('./routes/product.routes');
const productImageRouter = require('./routes/productImage.routes');
const cartRouter = require('./routes/cart.routes');
const categoryRouter = require('./routes/category.routes');
const brandRouter = require('./routes/brand.routes');
const wishlistRouter = require('./routes/wishlist.routes');
const orderRouter = require('./routes/order.routes');
const addressRouter = require('./routes/address.routes');
const paymentMethodRouter = require('./routes/paymentMethod.routes');
const reviewRouter = require('./routes/review.routes');
const scheduleTelegramJob = require('./schedulers/telegram.scheduler');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRouter);
app.use('/api', userRouter);
app.use('/api/file', fileRouter);
app.use('/api', productRouter);
app.use('/api', productImageRouter);
app.use('/api', cartRouter);
app.use('/api', categoryRouter);
app.use('/api', brandRouter);
app.use('/api', wishlistRouter);
app.use('/api', orderRouter);
app.use('/api', addressRouter);
app.use('/api', paymentMethodRouter);
app.use('/api', reviewRouter);
app.get('/', (req, res) => {
  res.send('Hello World!');
});

scheduleTelegramJob();

app.listen(port, '0.0.0.0', () => {
  console.log(`Local access: http://localhost:${port}`);
  console.log(`Network access: http://192.168.1.16:${port}`);
});

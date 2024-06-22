import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(helmet());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200,
  })
);

app.options('*', cors());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20000,
});
app.use(limiter);

app.use(
  '/v1/users',
  createProxyMiddleware({
    target: `${process.env.USERS_API}/v1/users`,
  })
);

app.use(
  '/v1/auth',
  createProxyMiddleware({
    target: `${process.env.USERS_API}/v1/auth`,
  })
);

app.use(
  '/v1/products/uploads',
  createProxyMiddleware({
    target: `${process.env.PRODUCTS_API}/v1/uploads`,
    on: {
      proxyRes: (proxyRes) => {
        proxyRes.headers['Access-Control-Allow-Origin'] = process.env.CLIENT_URL || '';
        proxyRes.headers['Cross-Origin-Resource-Policy'] = 'cross-origin';
      },
    },
  })
);

app.use(
  '/v1/products',
  createProxyMiddleware({
    target: `${process.env.PRODUCTS_API}/v1/products`,
  })
);

app.use(
  '/v1/products',
  createProxyMiddleware({
    target: `${process.env.PRODUCTS_API}/v1/products`,
  })
);

app.use(
  '/v1/stock',
  createProxyMiddleware({
    target: `${process.env.STOCK_API}/v1/stock`,
  })
);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

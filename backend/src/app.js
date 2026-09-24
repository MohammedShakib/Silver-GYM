import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { errorHandler } from './middlewares/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import gymsRoutes from './routes/gyms.routes.js';
import membersRoutes from './routes/members.routes.js';
import membershipsRoutes from './routes/memberships.routes.js';
import checkInsRoutes from './routes/checkIns.routes.js';
import plansRoutes from './routes/plans.routes.js';
import paymentRoutes from './routes/payment.routes.js';
import passRoutes from './routes/pass.routes.js';
import partnerRoutes from './routes/partner.routes.js';
import notificationRoutes from './routes/notification.routes.js';

const app = express();

app.use(helmet());
app.use(cors({ 
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true 
}));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());

const apiLimiter = rateLimit({
  windowMs: process.env.RATE_LIMIT_WINDOW_MS || 15 * 60 * 1000,
  max: process.env.RATE_LIMIT_MAX_REQUESTS || 100,
  message: { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', apiLimiter);

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/gyms', gymsRoutes);
app.use('/api/v1/me', membersRoutes);
app.use('/api/v1/me/membership', membershipsRoutes);
app.use('/api/v1/check-ins', checkInsRoutes);
app.use('/api/v1/plans', plansRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/pass', passRoutes);
app.use('/api/v1/partner', partnerRoutes);
app.use('/api/v1/notifications', notificationRoutes);

// Error handling
app.use(errorHandler);

export default app;

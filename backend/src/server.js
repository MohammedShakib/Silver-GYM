import 'dotenv/config';
import app from './app.js';
import notificationWorker from './workers/notificationWorker.js';
import renewalScheduler from './workers/renewalScheduler.js';

const PORT = process.env.PORT || 3001;

// Startup Environment Validation
const requiredEnv = ['DATABASE_URL', 'SESSION_SECRET'];
for (const env of requiredEnv) {
  if (!process.env[env]) {
    console.error(`[FATAL] Missing required environment variable: ${env}`);
    process.exit(1);
  }
}

if (process.env.NODE_ENV === 'production') {
  if (process.env.SESSION_SECRET === 'your_super_secret_session_key_here' || process.env.SESSION_SECRET.length < 32) {
    console.error(`[FATAL] SESSION_SECRET is insecure for production`);
    process.exit(1);
  }
  if (!process.env.PAYMENT_PROVIDER || process.env.PAYMENT_PROVIDER === 'DEMO') {
    console.error(`[FATAL] PAYMENT_PROVIDER cannot be DEMO or missing in production`);
    process.exit(1);
  }
}

app.listen(PORT, () => {
  console.log(`Silver GYM API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  notificationWorker.start();
  renewalScheduler.start();
});

import 'dotenv/config';
import app from './app.js';
import notificationWorker from './workers/notificationWorker.js';
import renewalScheduler from './workers/renewalScheduler.js';

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Silver GYM API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
  notificationWorker.start();
  renewalScheduler.start();
});

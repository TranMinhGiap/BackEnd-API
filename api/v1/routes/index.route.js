const taskRoutes = require('./task.route');
const userRoutes = require('./user.route');

const authMiddleware = require("../middleware/auth.middleware");

module.exports = (app) => {
  const version = '/api/v1';
  app.use(version + '/tasks', authMiddleware.requireAuth, taskRoutes)
  // do tất cả các api tasks cần bảo mật  
  app.use(version + '/users', userRoutes)
}

const authJwt = require("../middlewares/authJwt");

const controller = require('../controllers/user.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  
  app.get('/api/user/', controller.getAllUsers);
  app.get('/api/user/:id', controller.getUserById);

  // app.get('/api/user/', authJwt.verifyToken, authJwt.isAdmin, controller.getAllUsers);
  // app.post('/', authJwt.verifyToken, authJwt.isAdmin, controller.createUser);
  app.post('/api/user/', controller.createUser);
  app.put('/api/user/:id', authJwt.verifyToken, authJwt.isAdmin, controller.updateUser);
  app.delete('/api/user/:id',authJwt.verifyToken, authJwt.isAdmin, controller.deleteUser);
};
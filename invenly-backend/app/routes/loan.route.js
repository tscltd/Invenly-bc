const authJwt = require("../middlewares/authJwt");
const controller = require('../controllers/loan.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  app.post('/loan/batch', authJwt.verifyToken, controller.createBatchLoan);
}

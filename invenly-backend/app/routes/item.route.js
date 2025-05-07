const authJwt = require("../middlewares/authJwt");
const controller = require('../controllers/item.controller');

module.exports = function (app) {
  app.use(function (req, res, next) {
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, Content-Type, Accept"
    );
    next();
  });

  // CRUD vật phẩm
  app.get('/api/item', controller.getAllItems);
  app.get('/api/items/code/:code', controller.getItemByCode);
  app.get('/api/item/:id', controller.getItemById);
  app.post('/api/item', controller.createItem);
  app.put('/api/item/:id', controller.updateItem);
  app.delete('/api/item/:id', controller.deleteItem);

  // Nếu có các route mở rộng sau này (nhập thêm số lượng, lọc theo category...)
//   app.post('/api/items', authJwt.verifyToken, authJwt.isAdmin, controller.createItem);

};

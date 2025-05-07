const Item = require("../models/item.model");

// Lấy danh sách tất cả vật phẩm
exports.getAllItems = async (req, res) => {
  try {
    const items = await Item.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Lấy chi tiết một vật phẩm theo ID
exports.getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Không tìm thấy vật phẩm" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

exports.getItemByCode = async (req, res) => {
    try {
      const item = await Item.findOne({ code: req.params.code });
      if (!item) {
        return res.status(404).json({ error: "Không tìm thấy vật phẩm với mã này" });
      }
      res.json(item);
    } catch (err) {
      res.status(500).json({ error: "Lỗi server" });
    }
  };
  

// Tạo mới vật phẩm
exports.createItem = async (req, res) => {
    try {
      const {
        name, category, description, totalQuantity,
        minThreshold, imageUrl, manager, source
      } = req.body;
  
      const timestamp = Date.now();
      const code = `ITEM-${timestamp}`; // Ví dụ: ITEM-1714990109923
  
      const item = new Item({
        name,
        code,
        category,
        description,
        totalQuantity,
        remainingQuantity: totalQuantity,
        minThreshold,
        imageUrl,
        manager,
        source
      });
  
      await item.save();
  
      res.status(201).json({
        message: "Tạo vật phẩm thành công",
        item
      });
    } catch (err) {
      res.status(500).json({ error: "Lỗi server" });
    }
};
  
// Cập nhật vật phẩm
exports.updateItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!item) return res.status(404).json({ error: "Không tìm thấy vật phẩm" });
    res.json({ message: "Cập nhật thành công", item });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Xoá vật phẩm
exports.deleteItem = async (req, res) => {
  try {
    const item = await Item.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ error: "Không tìm thấy vật phẩm" });
    res.json({ message: "Đã xoá vật phẩm" });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

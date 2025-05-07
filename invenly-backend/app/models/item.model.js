const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: String,
  code: { type: String, unique: true }, // Mã dán vào vật phẩm
  category: { type: String, enum: ["thu_vien", "qua_tang", "vat_pham", "khac"] },
  description: String,
  imageUrl: String,
  manager: String,
  source: String,
  isLoaned: { type: Boolean, default: false },
  isDamaged: { type: Boolean, default: false },
  // Thuộc tính động cho từng loại
  attributes: [
    {
      key: String,
      value: String
    }
  ]
}, { timestamps: true });

module.exports = mongoose.model("item", itemSchema);

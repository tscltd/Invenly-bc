const BorrowRequest = require('../models/borrowRequest.model');

exports.createRequest = async (req, res) => {
  try {
    const { name, email, phone, note, itemId } = req.body;

    if (!name || !email || !itemId) {
      return res.status(400).json({ message: 'Thiếu thông tin bắt buộc' });
    }

    const request = new BorrowRequest({ name, email, phone, note, itemId });
    await request.save();

    res.json({ message: 'Đã gửi yêu cầu mượn' });
  } catch (err) {
    console.error('[BORROW ERROR]', err);
    res.status(500).json({ message: 'Lỗi server khi tạo yêu cầu' });
  }
};

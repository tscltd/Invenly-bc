const Item = require('../models/item.model');
const Loan = require('../models/loan.model');

exports.createBatchLoan = async (req, res) => {
  try {
    const { borrowerName, items } = req.body;

    if (!borrowerName || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Thiếu thông tin mượn' });
    }

    const now = new Date();

    // Lấy danh sách mã cần kiểm tra
    const itemCodes = items.map(i => i.code);
    const dbItems = await Item.find({ code: { $in: itemCodes }, isLoaned: false, isDeleted: { $ne: true } });

    const successLoans = [];
    const failedCodes = [];

    for (const itemData of items) {
      const dbItem = dbItems.find(i => i.code === itemData.code);

      if (!dbItem) {
        failedCodes.push(itemData.code);
        continue;
      }

      const loan = new Loan({
        itemId: dbItem._id,
        borrowerName,
        loanDate: now,
        returnDueDate: itemData.returnDueDate,
        status: 'borrowed',
        damaged: itemData.damaged || false,
        damageNote: itemData.damageNote || '',
        borrowerImageUrl: itemData.borrowerImageUrl || '',
        createdBy: req.user._id, // ✅ lấy từ token
      });

      await loan.save();
      dbItem.isLoaned = true;
      await dbItem.save();

      successLoans.push(loan);
    }

    return res.json({
      message: `Đã ghi nhận ${successLoans.length} vật phẩm mượn`,
      success: successLoans.length,
      failed: failedCodes,
    });
  } catch (err) {
    console.error('Lỗi tạo phiếu mượn:', err);
    return res.status(500).json({ error: 'Lỗi server' });
  }
};

import mongoose from "mongoose";

const loanSchema = new mongoose.Schema({
  itemId: { type: mongoose.Schema.Types.ObjectId, ref: "item" },
  borrowerName: String,
  loanDate: Date,
  returnDueDate: Date,
  returnDate: Date,
  status: { type: String, enum: ["borrowed", "returned"], default: "borrowed" },
  damaged: Boolean,
  damageNote: String,
  borrowerImageUrl: String,
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" }
}, { timestamps: true });

export default mongoose.model("loan", loanSchema);

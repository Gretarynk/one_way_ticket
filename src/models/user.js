import mongoose from "mongoose";

// import TicketModel from "./ticket.js";

const userSchema = mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, min: 3 },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
  },
  password: {
    type: String,
    required: true,
    min: 6,
  },
  purchasedTickets: [
    { type: mongoose.Schema.Types.ObjectId, ref: "TicketModel" },
  ],
  walletBalance: { type: Number, required: true },
});

userSchema.methods.purchaseTicket = async function (ticketId, ticketPrice) {
  if (this.walletBalance < ticketPrice) {
    throw new Error ("Not enough balance to purchase ticket");
  }
  this.purchasedTickets.push(ticketId);
  this.walletBalance -= ticketPrice;
  await this.save();
};

export default mongoose.model("User", userSchema);

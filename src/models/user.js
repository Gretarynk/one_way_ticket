import mongoose from "mongoose";

import TicketModel from "./ticket.js";
// biome-ignore lint/complexity/useArrowFunction: <explanation>
const validateEmail = function (email) {
  const re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  return re.test(email);
};

const userSchema = mongoose.Schema({
  _id: { type: String, required: true },
  name: { type: String, required: true, min: 3 },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    unique: true,
    required: "Email address is required",
    validate: [validateEmail, "Please fill a valid email address"],
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      "Please fill a valid email address",
    ],
  },
  password: {
    type: String,
    required: true, min: 6,
    
  },
  purchasedTickets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'TicketModel' }],
  walletBalance: { type: Number, required: true },
});

userSchema.methods.purchaseTicket= async function(ticketId, ticketPrice){
  if(this.walletBalance<ticketPrice){
    return'Not enough balance to purchase ticket';
  }this.purchasedTickets.push(ticketId);
  this.walletBalance -= ticketPrice;
  await this.save();
}

export default mongoose.model("User", userSchema);

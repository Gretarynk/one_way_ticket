import mongoose from "mongoose";
// import UserModel from "./user.js";

const ticketSchema = mongoose.Schema({
  id: { type: String, required: true },
  title: { type: String, required: true, min: 3 },
  ticketPrice: { type: Number, required: true },
  departureLocation: { type: String, required: true },
  arrivingLocation: { type: String, required: true },
  destinationPhotoUrl: { type: String, required: true },
  purchaserUser: { type: mongoose.Schema.Types.ObjectId, ref: "UserModel" },
});

export default mongoose.model("Ticket", ticketSchema);



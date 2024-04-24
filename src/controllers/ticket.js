import { v4 as uuidv4 } from "uuid";
import mongoose from "mongoose";
import UserModel from "../models/user.js";
import TicketModel from "../models/ticket.js";

const POST_CREATE_TICKET = async (req, res) => {
  try {
    const ticket = new TicketModel({
      id: uuidv4(),
      ...req.body,
    });
    const response = await ticket.save();
    res
      .status(201)
      .json({ status: "Ticket was added to the list", response: response });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ message: "Error happened" });
  }
};

const GET_ALL_TICKETS = async (req, res) => {
  try {
    const tickets = await TicketModel.find().sort({ arrivingLocation: 1 });

    return res.status(200).json({ message: "All tickets", tickets: tickets });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ message: "Error happened to get all items" });
  }
};
const GET_TICKET_BY_ID = async (req, res) => {
  try {
    const ticket = await TicketModel.findOne({ id: req.params.id });

    return res.status(200).json({ message: "ticket by id", ticket: ticket });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ message: "Error get item by id" });
  }
};
const BUY_TICKET_BY_ID = async (req, res) => {
  try {
    const userId = req.body.userId;
    // console.log('userId', userId)

    const ticket = await TicketModel.findOne({ id: req.params.id });

    if (!ticket) {
      return res
        .status(404)
        .json({ message: `ticket with id ${req.params.id} not found` });
    }
    const user = await UserModel.findOne({ _id: userId });
    //  console.log('user retrivied', user)
    await user.purchaseTicket(ticket._id, ticket.ticketPrice);
    const destination = ticket.arrivingLocation;
    return res
      .status(200)
      .json({ message: `ticket to ${destination} was purchased successfully ` });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ message: "Error get item by id" });
  }
};
const DELETE_TICKET_BY_ID = async (req, res) => {
  try {
    const deletedTicket = await TicketModel.findOneAndDelete({
      id: req.params.id,
    });
    if (!deletedTicket) {
      return res.status(401).json({ message: "Ticket by such id not found" });
    }
    return res
      .status(200)
      .json({ message: `Ticket with id ${req.params.id} deleted` });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ message: "Error delete item by id" });
  }
};
const UPDATE_TICKET_BY_ID = async (req, res) => {
  try {
    const updatedTicket = await FlowerModel.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(401).json({
        message: "Ticket by such id not found",
        flower: updatedTicket,
      });
    }
    return res.status(200).json({ message: "ticket info was updated" });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ message: "Error update item by id" });
  }
};

export {
  GET_ALL_TICKETS,
  POST_CREATE_TICKET,
  GET_TICKET_BY_ID,
  DELETE_TICKET_BY_ID,
  UPDATE_TICKET_BY_ID,
  BUY_TICKET_BY_ID,
};

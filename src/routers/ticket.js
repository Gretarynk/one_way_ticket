import express from "express";
import {
  GET_ALL_TICKETS,
  POST_CREATE_TICKET,
  GET_TICKET_BY_ID,
  BUY_TICKET_BY_ID,
  DELETE_TICKET_BY_ID,
  UPDATE_TICKET_BY_ID,
} from "../controllers/ticket.js";
import validation from "../middleware/validation.js";
import ticketValidationSchema from "../validationSchema/ticket.js";
import {auth} from "../middleware/auth.js"; 
const router = express.Router();

router.get("/tickets",auth, GET_ALL_TICKETS);
router.get("/tickets/:id", GET_TICKET_BY_ID);
router.post("/tickets",validation(ticketValidationSchema),auth, POST_CREATE_TICKET);
router.post("/tickets/:id",auth, BUY_TICKET_BY_ID);
router.put("/tickets/:id", UPDATE_TICKET_BY_ID);
router.delete("/ticket/:id", DELETE_TICKET_BY_ID);

export default router;

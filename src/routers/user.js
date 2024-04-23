import express from "express";
const router = express.Router();
import {
  SIGN_UP,
  LOG_IN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_USERS_WITH_TICKETS,
  GET_USERS_WITH_TICKETS_INFO,
  
  NEW_REFRESH_TOKEN,
} from "../controllers/user.js";

import {auth} from "../middleware/auth.js";

router.post("/users", SIGN_UP);
router.post("/users/login", LOG_IN);
router.post("/token",NEW_REFRESH_TOKEN);
router.get("/users", auth, GET_ALL_USERS);
router.get("/users/:id", auth, GET_USER_BY_ID);
router.get("/users-tickets", auth, GET_USERS_WITH_TICKETS);
router.get("/users-tickets-info", auth, GET_USERS_WITH_TICKETS_INFO);

export default router;

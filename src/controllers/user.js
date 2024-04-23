import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";
import { firstLetterCapital, validatePassword } from "../helpers/validators.js";
import {
  generateTokens,
  verifyRefreshToken,
  refreshJwtToken,
} from "../middleware/token.js";

const SIGN_UP = async (req, res) => {
  try {
    // console.log("Request body:", req.body);
    if (!validatePassword(req.body.password)) {
      return res.status(400).json({
        message:
          "Password must be at least 6 characters long and contain at least one numeric digit",
      });
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(req.body.password, salt);

    const user = new UserModel({
      _id: uuidv4(),
      name: firstLetterCapital(req.body.name),
      email: req.body.email,
      password: hash,
      purchasedTickets: [],
      walletBalance: req.body.walletBalance,
    });

    const response = await user.save();

    const { jwt_token, refresh_token } = generateTokens(
      response.id,
      response.email
    );

    return res.status(200).json({
      message: `Account ${firstLetterCapital(
        req.body.name
      )} successfully created `,
      user: response,
      jwt_token: jwt_token,
      refresh_token: refresh_token,
    });
  } catch (err) {
    if (err.name === "ValidationError" && err.errors.email) {
      return res.status(400).json({ message: "Invalid email format" });
      // biome-ignore lint/style/noUselessElse: <explanation>
    } else {
      console.log("HANDLED ERROR:", err);
      return res.status(500).json({ message: "Error happened" });
    }
  }
};

const LOG_IN = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    const isPasswordMatch = bcrypt.compareSync(
      req.body.password,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { jwt_token, refresh_token } = generateTokens(user.id, user.email);
    return res.status(200).json({
      message: " User logged in",
      jwt_token: jwt_token,
      refresh_token: refresh_token,
    });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ message: "Error happened" });
  }
};

const GET_ALL_USERS = async (req, res) => {
  try {
    const users = await UserModel.find().sort({ name: 1 });
    if (!users.length) {
      return res.status(401).json({ message: "there no users" });
    }
    return res.status(200).json({ message: "All users", users: users });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ message: "Error happened to get all users" });
  }
};
const GET_USER_BY_ID = async (req, res) => {
  try {
    const user = await UserModel.findOne({ id: req.params.id });
    if (!user) {
      return res
        .status(404)
        .json({ message: `user with ${req.params.id} not exist ` });
    }
    return res
      .status(200)
      .json({ message: `user with ${req.params.id} `, user: user });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ message: "Error happened to get all users" });
  }
};
const GET_USERS_WITH_TICKETS = async (req, res) => {
  try {
    const usersWithTickets = await UserModel.find({
      purchasedTickets: { $exists: true, $ne: [] },
    });
    console.log(usersWithTickets)
    if (!usersWithTickets.length) {
      return res.status(404).json({ message: "There no users with tickets" });
    }
    return res
      .status(200)
      .json({
        message: "Users with purchased tickets",
        users: usersWithTickets,
      });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ message: "Error happened to get all users" });
  }
};
const GET_USERS_WITH_TICKETS_INFO = async (req, res) => {
  try {
    const usersWithTickets = await UserModel.aggregate([
      {
        $match: {
          purchasedTickets: { $exists: true, $ne: [] }
        }
      },
      {
        $lookup: {
          from: "tickets", // Collection name where tickets are stored
          localField: "purchasedTickets",
          foreignField: "_id",
          as: "purchasedTicketsInfo"
        }
      }
    ]);

    if (!usersWithTickets.length) {
      return res.status(404).json({ message: "There are no users with purchased tickets" });
    }

    return res.status(200).json({
      message: "Users with purchased tickets",
      users: usersWithTickets
    });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ message: "Error occurred while fetching users with tickets" });
  }
};
const NEW_REFRESH_TOKEN = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    const decodedToken = verifyRefreshToken(refresh_token);

    if (!decodedToken) {
      return res.status(401).json({
        message: "Invalid or expired refresh token. Please log in again.",
      });
    }
    const { jwtToken, newRefreshToken } = refreshJwtToken(refresh_token);
    return res.status(200).json({
      message: "New JWT token generated",
      jwt_token: jwtToken,
      refresh_token: newRefreshToken,
    });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ message: "Error happened to get all users" });
  }
};



export {
  SIGN_UP,
  LOG_IN,
  GET_ALL_USERS,
  GET_USER_BY_ID,
  GET_USERS_WITH_TICKETS,
  NEW_REFRESH_TOKEN,
  GET_USERS_WITH_TICKETS_INFO,
};

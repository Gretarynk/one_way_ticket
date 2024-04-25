import Joi from "joi";
// import { firstLetterCapital } from "../helpers/validators";
import { firstLetterCapital } from "../helpers/validators.js";
const UserSchema =Joi.object({
    name:Joi.string().required(),
    email:Joi.string().required(),
    password:Joi.string().required(),
    purchasedTickets:Joi.array().required(),
    walletBalance:Joi.number().required(),
});

export default UserSchema;
import Joi from "joi";

const ticketSchema =Joi.object({
    // status:Joi.boolean().required(),
    title:Joi.string().required(),
    ticketPrice:Joi.number().required(),
    departureLocation:Joi.string().required(),
    arrivingLocation:Joi.string().required(),
    destinationPhotoUrl:Joi.string().required(),
});

export default ticketSchema;


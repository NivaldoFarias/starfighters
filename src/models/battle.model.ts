import Joi from 'joi';

const pattern = /^[a-zA-Z0-9]{3,39}(-[a-zA-Z0-9]{3,39})*$/;
const battleSchema = Joi.object({
  firstUser: Joi.string().pattern(pattern).required(),
  secondUser: Joi.string().pattern(pattern).required(),
});

export default battleSchema;

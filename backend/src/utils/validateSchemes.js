import Joi from 'joi';
import { registerTranslator } from './errorTranslations.js';

const customErrorMessages = (keyName, message) => {
  let returnErrorMessageObj = {
    'string.empty': `${keyName}: ${message.empty}`,
    'string.min': `${keyName}: ${message.min}`,
    'string.max': `${keyName}: ${message.max}`,
    'string.email': `${keyName}: ${message.email}`,
    'string.base': `${keyName}: ${message.base}`,
    'string.pattern.base': `${keyName}: ${message.pattern}`,
    'any.only': `${keyName}: ${message.anyOnly}`,
  };

  return returnErrorMessageObj;
};

export const userSchema = Joi.object({
  firstName: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages(
      customErrorMessages(registerTranslator.de.key.firstName, registerTranslator.de.message)
    ),
  lastName: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages(
      customErrorMessages(registerTranslator.de.key.lastName, registerTranslator.de.message)
    ),
  description: Joi.string()
    .optional()
    .max(255)
    .allow(null, '')
    .messages(
      customErrorMessages(registerTranslator.de.key.description, registerTranslator.de.message)
    ),
  location: Joi.string()
    .required()
    .messages(
      customErrorMessages(registerTranslator.de.key.location, registerTranslator.de.message)
    ),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^[a-zA-Z0-9]+$'))
    .messages(
      customErrorMessages(registerTranslator.de.key.password, registerTranslator.de.message)
    ),
  repeatPassword: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .messages(
      customErrorMessages(registerTranslator.de.key.repeatPassword, registerTranslator.de.message)
    ),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'de'] } })
    .required()
    .messages(customErrorMessages(registerTranslator.de.key.email, registerTranslator.de.message)),
  profileImage: Joi.binary().encoding('base64').allow(null, ''),
  ipAddress: Joi.string()
    .ip({
      version: ['ipv4', 'ipv6'],
      cidr: 'required',
    })
    .allow(null, ''),
});

export const validateData = (data, cbSchema) => {
  // Validierung nicht beim ersten Fehler stoppen
  const options = {
    abortEarly: false,
  };
  return cbSchema.validate(data, options);
};

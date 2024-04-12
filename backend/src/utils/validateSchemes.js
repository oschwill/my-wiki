import Joi from 'joi';
import { authTranslator } from './errorTranslations.js';

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
    .messages(customErrorMessages(authTranslator.de.key.firstName, authTranslator.de.message)),
  lastName: Joi.string()
    .min(3)
    .max(20)
    .required()
    .messages(customErrorMessages(authTranslator.de.key.lastName, authTranslator.de.message)),
  description: Joi.string()
    .optional()
    .max(255)
    .allow(null, '')
    .messages(customErrorMessages(authTranslator.de.key.description, authTranslator.de.message)),
  location: Joi.string()
    .required()
    .messages(customErrorMessages(authTranslator.de.key.location, authTranslator.de.message)),
  password: Joi.string()
    .min(8)
    .pattern(new RegExp('^[a-zA-Z0-9]+$'))
    .messages(customErrorMessages(authTranslator.de.key.password, authTranslator.de.message)),
  repeatPassword: Joi.any()
    .equal(Joi.ref('password'))
    .required()
    .messages(customErrorMessages(authTranslator.de.key.repeatPassword, authTranslator.de.message)),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'de'] } })
    .required()
    .messages(customErrorMessages(authTranslator.de.key.email, authTranslator.de.message)),
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

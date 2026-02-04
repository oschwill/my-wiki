import Joi from 'joi';
import { authTranslator, contentTranslator } from './errorTranslations.js';

const customErrorMessages = (keyName, message) => {
  let returnErrorMessageObj = {
    'string.empty': `${keyName}: ${message.empty}`,
    'string.min': `${keyName}: ${message.min}`,
    'string.max': `${keyName}: ${message.max}`,
    'string.email': `${keyName}: ${message.email}`,
    'string.base': `${keyName}: ${message.base}`,
    'string.pattern.base': `${keyName}: ${message.pattern}`,
    'any.only': `${keyName}: ${message.anyOnly}`,
    'any.required': `${keyName}: ${message.required}`,
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
      cidr: 'forbidden',
    })
    .allow(null, ''),
  // Optional
  twoFactorAuth: Joi.boolean().optional(),
  loginVerifyToken: Joi.boolean().optional(),
  notifyOnNewArticles: Joi.boolean().optional(),
  emailNotifyOnNewArticles: Joi.boolean().optional(),
  allowMessages: Joi.boolean().optional(),
  isProfilePrivate: Joi.boolean().optional(),
  isEmailPrivate: Joi.boolean().optional(),
  locale: Joi.string()
    .pattern(/^[a-z]{2}(-[A-Z]{2})?$/)
    .optional()
    .messages(customErrorMessages(authTranslator.de.key.locale, authTranslator.de.message)),
});

export const contentSchema = Joi.object({
  areaTitle: Joi.string()
    .min(3)
    .max(60)
    .required()
    .messages(customErrorMessages(contentTranslator.de.key.area, contentTranslator.de.message)),
  categoryTitle: Joi.string()
    .min(2)
    .max(60)
    .required()
    .messages(customErrorMessages(contentTranslator.de.key.category, contentTranslator.de.message)),
  description: Joi.string()
    .min(10)
    .max(255)
    .required()
    .messages(
      customErrorMessages(contentTranslator.de.key.description, contentTranslator.de.message),
    ),
  content: Joi.string()
    .required()
    .max(20000)
    .messages(
      customErrorMessages(contentTranslator.de.key.description, contentTranslator.de.message),
    ),
  contentTitle: Joi.string()
    .required()
    .min(10)
    .max(75)
    .messages(
      customErrorMessages(contentTranslator.de.key.contentTitle, contentTranslator.de.message),
    ),
  reference: Joi.string()
    .pattern(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages(
      customErrorMessages(contentTranslator.de.key.reference, contentTranslator.de.message),
    ),
});

export const validateData = (data, cbSchema) => {
  // Validierung nicht beim ersten Fehler stoppen
  const options = {
    abortEarly: false,
  };
  return cbSchema.validate(data, options);
};

// Erzeuge neuen Schema aus Attributes
const dynamicSchema = (attributesToValidate, schema) => {
  return Joi.object(
    Object.fromEntries(
      attributesToValidate.map((attribute) => [
        attribute,
        schema
          .extract(attribute)
          .messages(
            customErrorMessages(authTranslator.de.key[attribute], authTranslator.de.message),
          ),
      ]),
    ),
  );
};

export const validatorHelperFN = (attributes, data, schema) => {
  const dys = dynamicSchema(attributes, schema);

  const { error, value } = validateData(data, dys);

  return { error, value };
};

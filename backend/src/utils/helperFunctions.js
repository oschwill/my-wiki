import fs from 'fs/promises';
import xss from 'xss';

export const createEmailTemplate = async (template, input) => {
  let htmlTemplate = await fs.readFile(template, 'utf8');

  input.forEach((item) => {
    htmlTemplate = htmlTemplate.replace(item.placeholder, item.data);
  });

  return htmlTemplate;
};

export const sanitizeInputs = (inputs) => {
  const sanitized = {};

  for (const key in inputs) {
    sanitized[key] = xss(inputs[key]);
  }

  return sanitized;
};

export const generateRandomPassword = (length = 12) => {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_-+=<>?';
  let password = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }

  return password;
};

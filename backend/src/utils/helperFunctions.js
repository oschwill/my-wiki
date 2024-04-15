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

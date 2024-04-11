import fs from 'fs/promises';

export const createEmailTemplate = async (template, input) => {
  let htmlTemplate = await fs.readFile(template, 'utf8');

  input.forEach((item) => {
    htmlTemplate = htmlTemplate.replace(item.placeholder, item.data);
  });

  return htmlTemplate;
};

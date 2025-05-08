import { authTranslator } from './errorTranslations.js';

export const globalMiddlewareErrorHandling = (err, req, res, next) => {
  if (err) {
    const errorMap = {
      LIMIT_FILE_SIZE: authTranslator.de.message.limitFileSize,
      LIMIT_FILE_COUNT: authTranslator.de.message.limitFileCount,
      LIMIT_UNEXPECTED_FILE: authTranslator.de.message.limitUnexpectedFile,
      UPLOAD_FAILED: authTranslator.de.message.upload,
      NO_AUTH: null,
    };

    if (err.code === 'NO_AUTH') {
      return res.status(err.statusCode).json(null);
    }

    const message = errorMap[err.code] || authTranslator.de.message.general;
    return res.status(err.statusCode || 400).json({ success: false, error: message });
  }
};

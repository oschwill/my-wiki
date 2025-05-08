import { changeImage } from '../utils/cloudHelper.js';
import { GlobalErrorResponse } from '../utils/error/globalError.js';
import { getOrCreateCloudPath } from '../utils/userProfileHelper.js';

export const changeProfileImage = async (req, res, next) => {
  const { email } = req.user;

  if (req.file) {
    const dynamicPath = await getOrCreateCloudPath(email);

    const upload = await changeImage(`${dynamicPath}`, req.file, email, dynamicPath);

    if (!upload.status) {
      return next(new GlobalErrorResponse(401, 'UPLOAD_FAILED'));
    }
  }

  const user = req.user;
  next();
};

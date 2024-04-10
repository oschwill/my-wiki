import bcrypt from 'bcrypt';

export const registerUser = async (req, res) => {
  const userData = req.body;
  let fileData = null;

  if (req.fileData) {
    fileData = {
      publicId: req?.fileData.public_id,
      url: req?.fileData.url,
    };
  }

  console.log('fileData', fileData);
  console.log('userData', userData);
};

import fs, { unlink } from 'fs';
import { promisify } from 'util';
import { v2 as cloudinary } from 'cloudinary';
import { authTranslator } from './errorTranslations.js';
import { updateUserFN } from './userProfileHelper.js';

// Asynchrone Dateiverwaltung
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(unlink);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

// MIDDLEWARE
export const uploadImage = async (folderPath, file) => {
  const buffer = file !== undefined ? await readFileAsync(file.path) : null;

  // Wenn Datei existiert dann hochladen
  try {
    if (buffer) {
      // wir hängen die file Daten an unser Request Object
      const fileData = await new Promise(async (resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: 'auto',
              folder: folderPath,
            },
            async (err, result) => {
              if (err) {
                return reject(err.message);
              }

              return resolve(result);
            }
          )
          .end(buffer);
      });
      // temp Datei wieder löschen nach Erfolg
      if (fileData.public_id) {
        await unlinkAsync(file.path);
      }

      return {
        status: true,
        fileData,
      };
    }
  } catch (error) {
    return {
      status: false,
      code: Number(500),
      responseMessage: authTranslator.de.message.upload,
    };
  }
};

export const deleteImage = async (file) => {
  await cloudinary.uploader.destroy(file);
};

export const changeImage = async (folderPath, file, email, dynamicPath) => {
  // Laden das neue Bild hoch
  const fileUpload = await uploadImage(folderPath, file);

  if (!fileUpload.status) {
    return fileUpload;
  }

  // Wir ändern den Pfad des Bildes in DB
  const fileData = {
    profileImage: {
      publicId: fileUpload.fileData.public_id,
      url: fileUpload.fileData.url,
      cloudPath: dynamicPath,
    },
  };
  const updateTable = await updateUserFN({ email, active: true }, fileData);

  if (!updateTable.status) {
    // Wenn die Pfadspeicherung nicht funzt, löschen wir wieder das neue Bild
    file && (await deleteImage(fileData.publicId));
    return updateTable;
  }

  // Löschen dann das alte Bild
  file && (await deleteImage(updateTable.oldData.profileImage.publicId));

  return {
    status: true,
    code: Number(201),
    message: 'Das Profilbild wurde erfolgreich geändert',
  };
};

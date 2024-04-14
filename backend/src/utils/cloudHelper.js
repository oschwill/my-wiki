import fs, { unlink } from 'fs';
import { promisify } from 'util';
import { v2 as cloudinary } from 'cloudinary';
import { authTranslator } from './errorTranslations.js';

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
    console.log(error);
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

export const changeImage = async (folderPath) => {
  // Laden das neue Bild hoch
  uploadImage('my-wiki/userProfile/profileImage');
  // Wir ändern den Pfad des Bildes in DB
  // Löschen dann das alte Bild
};

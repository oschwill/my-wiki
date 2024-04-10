import fs, { unlink } from 'fs';
import { promisify } from 'util';
import { v2 as cloudinary } from 'cloudinary';

// Asynchrone Dateiverwaltung
const readFileAsync = promisify(fs.readFile);
const unlinkAsync = promisify(unlink);

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_KEY,
  api_secret: process.env.CLOUD_SECRET,
});

export const uploadImage = (folderPath) => {
  return async function (req, res, next) {
    const buffer = req.file !== undefined ? await readFileAsync(req.file.path) : null;

    // Wenn Datei existiert dann hochladen
    if (buffer) {
      try {
        // wir hängen die file Daten an unser Request Object
        req.fileData = await new Promise(async (resolve, reject) => {
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
        if (req.fileData.public_id) {
          await unlinkAsync(req.file.path);
        }

        next();
      } catch (error) {
        console.log(error);
        res.status(500).send('Fehler beim Hochladen der Datei');
      }
    }

    next();
  };
};

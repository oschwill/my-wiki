import multer from 'multer';
import path from 'path';

// Dateigrößenlimit
const FILE_SIZE_LIMIT = 2 * 1024 * 1024; // 2 Megabyte

const storage = multer.diskStorage({
  destination: `${process.env.FILEPATH}/temp`, // Temporärer Speicherort
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  // Erlaubte Dateiendungen
  const filetypes = /jpeg|jpg|png/;
  // Überprüfen der Dateiendung
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  // Überprüfen des MIME-Typs
  const mimetype = filetypes.test(file.mimetype);

  if (mimetype && extname) {
    return cb(null, true);
  } else {
    return cb(new Error('Fehler: Nur jpeg,jpg und png sind erlaubt!'));
  }
};

export const upload = multer({
  storage: storage,
  limits: { fileSize: FILE_SIZE_LIMIT },
  fileFilter: fileFilter,
});

// Errorhandling
export const multerErrorHandling = (err, req, res, next) => {
  if (err) {
    // Fehler => z.B. Datei zu groß oder falscher Dateityp
    return res.status(400).json({ success: false, message: err.message });
  }

  // Ansonsten ganz normal fortfahren
  next();
};

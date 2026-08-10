import jwt from 'jsonwebtoken';
import { authTranslator } from '../utils/errorTranslations.js';
import { GlobalErrorResponse } from '../utils/error/globalError.js';
import articleModel from '../models/articleModel.js';
import commentModel from '../models/commentModel.js';

const cookieOptions = (hasHttpFlag, isSecure) => {
  return {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: hasHttpFlag,
    secure: isSecure,
    sameSite: 'none',
  };
};

export const verifyToken = (req, res, next) => {
  let token = req.cookies.auth || null;

  // FALLS BEARER JWT?
  if (!token && req.headers.authorization) {
    const bearerHeader = req.headers.authorization;
    if (bearerHeader.startsWith('Bearer ')) {
      token = bearerHeader.split(' ')[1]; // Token extrahieren
    }
  }

  // O AUTH CHECK
  if (req.isAuthenticated()) {
    req.user = {
      userId: req.user._id,
      email: req.user.email,
      role: req.user.role,
      profileImage: req.user.profileImage,
    };

    return next();
  }
  if (!token || token === 'null' || token === undefined) {
    return next(new GlobalErrorResponse(200, 'NO_AUTH')); // nich angemedeldet
  }

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return next(new GlobalErrorResponse(200, 'NO_AUTH')); // nich angemedeldet
    }
    req.user = user;
    next();
  });
};

export const createToken = (user) => {
  const userToken = {
    userId: user.userId || user._id,
    email: user.email,
    role: user.role,
  };
  const options = { expiresIn: `${process.env.JWT_COOKIE_EXPIRES_IN}d` };
  const accessToken = jwt.sign(userToken, process.env.ACCESS_TOKEN_SECRET, options);

  return accessToken;
};

export const createCookie = (accessToken, res) => {
  res.cookie('auth', accessToken, cookieOptions(true, true));
};

export const onlyForCreator = (req, res, next) => {
  if (req.user.role === 'creator' || req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({
      success: false,
      error: authTranslator.de.message.forbidden,
    });
  }
};

export const onlyForAdmin = (req, res, next) => {
  if (req.user.role === 'admin') {
    next();
  } else {
    res.status(401).json({
      success: false,
      error: authTranslator.de.message.forbidden,
    });
  }
};

export const onlyForCreatorProperty = async (req, res, next) => {
  const { externalUser } = req.query;
  const { id } = req.params;
  const user = req.user;

  if (user.role === 'admin') return next();

  const existingEntry = await articleModel.findById(id);
  // Ein Fremduser darf einen anderen Artikel bearbeiten und veröffentlichen?
  if (externalUser === 'true' && user.role === 'creator') {
    if (!existingEntry) {
      return res.status(404).json({ success: false, error: 'Artikel nicht gefunden' });
    }

    if (!existingEntry.allowEditing) {
      return res
        .status(403)
        .json({ success: false, error: 'Artikel darf nicht bearbeitet werden' });
    }
    return next();
  }

  // Meinen eigenen Artikel veröffentlichen
  if (user.role === 'creator' && existingEntry.createdBy.toString() === user.userId) {
    return next();
  }

  return res.status(401).json({ success: false, error: authTranslator.de.message.forbidden });
};

export const canDeleteComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = req.user;

    const comment = await commentModel.findById(id);

    if (!comment) {
      return res.status(404).json({
        success: false,
        error: 'Kommentar nicht gefunden',
      });
    }

    // Admin darf alles
    if (user.role === 'admin') {
      return next();
    }

    // Kommentar-Ersteller darf eigenen Kommentar löschen
    if (comment.user.toString() === user.userId) {
      return next();
    }

    return res.status(403).json({
      success: false,
      error: 'Keine Berechtigung zum Löschen dieses Kommentars',
    });
  } catch (err) {
    return res.status(401).json({ success: false, error: authTranslator.de.message.forbidden });
  }
};

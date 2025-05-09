import jwt from 'jsonwebtoken';
import { authTranslator } from '../utils/errorTranslations.js';
import { GlobalErrorResponse } from '../utils/error/globalError.js';

const cookieOptions = (hasHttpFlag, isSecure) => {
  return {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: hasHttpFlag,
    secure: isSecure,
    sameSite: 'lax',
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
    userId: user.userId,
    email: user.email,
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

export const onlyForCreatorProperty = (req, res, next) => {
  if (
    (req.user.role === 'creator' && req.user.email === req.body.email) ||
    req.user.role === 'admin'
  ) {
    next();
  } else {
    res.status(401).json({
      success: false,
      error: authTranslator.de.message.forbidden,
    });
  }
};

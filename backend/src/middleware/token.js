import jwt from 'jsonwebtoken';
import { authTranslator } from '../utils/errorTranslations.js';

const cookieOptions = (hasHttpFlag, isSecure) => {
  return {
    expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
    httpOnly: hasHttpFlag,
    secure: isSecure,
    sameSite: 'lax',
  };
};

export const verifyToken = (req, res, next) => {
  const token = req.cookies.auth;

  if (token === null) {
    return res.status(401).json({
      success: false,
      error: authTranslator.de.message.noAuth,
    });
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) {
        throw new Error(err);
      }

      req.user = user;
      next();
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      error: authTranslator.de.message.forbidden,
    });
  }
};

export const createToken = (user) => {
  const userToken = { userId: user.userId, email: user.email, role: user.role };
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

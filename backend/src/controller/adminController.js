import { deleteContentFN, insertOrUpdateContentFN } from '../utils/contentHelper.js';
import { sanitizeInputs } from '../utils/helperFunctions.js';
import { contentSchema, validatorHelperFN } from '../utils/validateSchemes.js';
import {
  manipulateUserRightsFN,
  deleteUserFN,
  getAllUserFN,
  insertLanguageFN,
  deleteLanguageFN,
  toggleLanguageFN,
} from '../utils/adminHelper.js';

export const insertArea = async (req, res) => {
  const { title, description, icon } = sanitizeInputs(req.body);

  // Valididierung
  const { error, value } = validatorHelperFN(
    ['areaTitle', 'description'],
    { areaTitle: title, description },
    contentSchema,
    res
  );

  if (error) {
    const returnErrorMessages = error.details.map((cur) => {
      const { path, message } = cur;
      return { path: path.join(''), message };
    });

    return res.status(401).json({
      success: false,
      error: returnErrorMessages,
    });
  }

  // queryPath erzeugen
  const queryPath = value.areaTitle
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  // Datenbank
  const response = await insertOrUpdateContentFN(
    {
      title: value.areaTitle,
      description: value.description,
      icon,
      queryPath,
    },
    'area',
    'Das Fachgebiet wurde erfolgreich eingefügt'
  );

  if (!response.status) {
    return res.status(response.code).json({
      success: false,
      error: {
        path: 'general',
        message: response.responseMessage.toString(),
      },
    });
  }

  return res.status(response.code).json({
    success: true,
    message: response.responseMessage,
    _id: response._id,
  });
};

export const insertCategory = async (req, res) => {
  console.log(req.body);
  const { area, title, description } = sanitizeInputs(req.body);

  // Valididierung
  const { error, value } = validatorHelperFN(
    ['reference', 'categoryTitle', 'description'],
    { reference: area, categoryTitle: title, description },
    contentSchema,
    res
  );

  if (error) {
    const returnErrorMessages = error.details.map((cur) => {
      const { path, message } = cur;
      return { path: path.join(''), message };
    });

    return res.status(401).json({
      success: false,
      error: returnErrorMessages,
    });
  }

  // Datenbank
  const response = await insertOrUpdateContentFN(
    {
      title: value.categoryTitle,
      description: value.description,
      area: value.reference,
    },
    'category',
    'Die Kategorie wurde erfolgreich eingefügt'
  );

  if (!response.status) {
    return res.status(response.code).json({
      success: false,
      error: {
        path: 'general',
        message: response.responseMessage.toString(),
      },
    });
  }

  return res.status(response.code).json({
    success: true,
    message: response.responseMessage,
    _id: response._id,
  });
};

export const updateArea = async (req, res) => {
  const { title, description, icon, _id } = sanitizeInputs(req.body);

  // Valididierung
  const { error, value } = validatorHelperFN(
    ['areaTitle', 'description'],
    { areaTitle: title, description },
    contentSchema,
    res
  );

  if (error) {
    const returnErrorMessages = error.details.map((cur) => {
      const { path, message } = cur;
      return { path: path.join(''), message };
    });

    return res.status(401).json({
      success: false,
      error: returnErrorMessages,
    });
  }

  const queryPath = value.areaTitle
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');

  // Datenbank
  const response = await insertOrUpdateContentFN(
    {
      title: value.areaTitle,
      description: value.description,
      icon,
      queryPath,
    },
    'area',
    'Das Fachgebiet wurde erfolgreich geändert',
    _id
  );

  if (!response.status) {
    return res.status(response.code).json({
      success: false,
      error: {
        path: 'general',
        message: response.responseMessage.toString(),
      },
    });
  }

  return res.status(response.code).json({
    success: true,
    message: response.responseMessage,
  });
};

export const updateCategory = async (req, res) => {
  const { area, title, description, _id } = sanitizeInputs(req.body);

  // Valididierung
  const { error, value } = validatorHelperFN(
    ['reference', 'categoryTitle', 'description'],
    { reference: area, categoryTitle: title, description },
    contentSchema,
    res
  );

  if (error) {
    const returnErrorMessages = error.details.map((cur) => {
      const { path, message } = cur;
      return { path: path.join(''), message };
    });

    return res.status(401).json({
      success: false,
      error: returnErrorMessages,
    });
  }

  // Datenbank
  const response = await insertOrUpdateContentFN(
    {
      title: value.categoryTitle,
      description: value.description,
      area: value.reference,
    },
    'category',
    'Die Kategorie wurde erfolgreich geändert',
    _id
  );

  if (!response.status) {
    return res.status(response.code).json({
      success: false,
      error: {
        path: 'general',
        message: response.responseMessage.toString(),
      },
    });
  }

  return res.status(response.code).json({
    success: true,
    message: response.responseMessage,
  });
};

export const deleteArea = async (req, res) => {
  const { id } = req.body;

  // Löschen des Contents
  const response = await deleteContentFN(id, 'area', 'Das Fachgebiet wurde erfolgreich gelöscht');

  if (!response.status) {
    return res.status(response.code).json({
      success: false,
      error: {
        path: 'general',
        message: response.responseMessage.toString(),
      },
    });
  }

  return res.status(response.code).json({
    success: true,
    message: response.responseMessage,
  });
};

export const deleteCategory = async (req, res) => {
  const { id } = req.body;

  // Löschen des Contents
  const response = await deleteContentFN(
    id,
    'category',
    'Die Kategorie wurde erfolgreich gelöscht'
  );

  if (!response.status) {
    return res.status(response.code).json({
      success: false,
      error: {
        path: 'general',
        message: response.responseMessage.toString(),
      },
    });
  }

  return res.status(response.code).json({
    success: true,
    message: response.responseMessage,
  });
};

export const blockOrUnblockUser = async (req, res) => {
  const { email } = sanitizeInputs(req.body);

  // User status ändern
  const response = await manipulateUserRightsFN(email, 'auth');

  if (!response.status) {
    return res.status(response.code).json({
      error: {
        path: 'general',
        message: response.responseMessage.toString(),
      },
    });
  }

  return res.status(response.code).json({
    success: true,
    message: response.responseMessage,
  });
};

export const deleteUser = async (req, res) => {
  const { email } = sanitizeInputs(req.body);

  const response = await deleteUserFN(email, 'Der User wurde erfolgreich gelöscht');

  if (!response.status) {
    return res.status(response.code).json({
      error: {
        path: 'general',
        message: response.responseMessage.toString(),
      },
    });
  }

  return res.status(response.code).json({
    success: true,
    message: response.responseMessage,
  });
};

export const upgradeOrDownGradeUserRights = async (req, res) => {
  const { email } = sanitizeInputs(req.body);

  // User status ändern
  const response = await manipulateUserRightsFN(email, 'upgrade');

  if (!response.status) {
    return res.status(response.code).json({
      error: {
        path: 'general',
        message: response.responseMessage.toString(),
      },
    });
  }

  return res.status(response.code).json({
    success: true,
    message: response.responseMessage,
  });
};

export const getAllUsers = async (req, res) => {
  const response = await getAllUserFN();
  return res.status(response.code).json({
    success: response.status,
    data: response.users,
  });
};

/* LANGUAGES */
export const insertLanguage = async (req, res) => {
  const response = await insertLanguageFN(req.body, 'Sprache erfolgreich erstellt.');
  return res.status(response.code).json({
    success: response.status,
    message: response.responseMessage,
  });
};

export const deleteLanguage = async (req, res) => {
  const response = await deleteLanguageFN(req.body.id, 'Sprache erfolgreich gelöscht.');
  return res.status(response.code).json({
    success: response.status,
    message: response.responseMessage,
  });
};

export const toggleLanguage = async (req, res) => {
  const { id, enabled } = req.body;

  const response = await toggleLanguageFN(id, enabled);

  return res.status(response.code).json({
    success: response.status,
    message: response.responseMessage,
  });
};

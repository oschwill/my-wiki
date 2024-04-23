import { deleteContentFN, insertOrUpdateContentFN } from '../utils/contentHelper.js';
import { sanitizeInputs } from '../utils/helperFunctions.js';
import { contentSchema, validatorHelperFN } from '../utils/validateSchemes.js';
import { manipulateUserRightsFN, deleteUserFN } from '../utils/adminHelper.js';

export const insertArea = async (req, res) => {
  const { area, description } = sanitizeInputs(req.body);

  // Valididierung
  const value = validatorHelperFN(
    ['area', 'description'],
    { area, description },
    contentSchema,
    res
  );

  if (!value) {
    return;
  }

  // Datenbank
  const response = await insertOrUpdateContentFN(
    {
      title: value.area,
      description: value.description,
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
  });
};

export const insertCategory = async (req, res) => {
  const { area, category, description } = sanitizeInputs(req.body);

  // Valididierung
  const value = validatorHelperFN(
    ['reference', 'category', 'description'],
    { reference: area, category, description },
    contentSchema,
    res
  );

  if (!value) {
    return;
  }

  // Datenbank
  const response = await insertOrUpdateContentFN(
    {
      title: value.category,
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
  });
};

export const updateArea = async (req, res) => {
  const { area, description, id } = sanitizeInputs(req.body);

  // Valididierung
  const value = validatorHelperFN(
    ['area', 'description'],
    { area, description },
    contentSchema,
    res
  );

  if (!value) {
    return;
  }

  // Datenbank
  const response = await insertOrUpdateContentFN(
    {
      title: value.area,
      description: value.description,
    },
    'area',
    'Das Fachgebiet wurde erfolgreich geändert',
    id
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
  const { area, category, description, id } = sanitizeInputs(req.body);

  // Valididierung
  const value = validatorHelperFN(
    ['reference', 'category', 'description'],
    { reference: area, category, description },
    contentSchema,
    res
  );

  if (!value) {
    return;
  }

  // Datenbank
  const response = await insertOrUpdateContentFN(
    {
      title: value.category,
      description: value.description,
      area: value.reference,
    },
    'category',
    'Die Kategorie wurde erfolgreich geändert',
    id
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

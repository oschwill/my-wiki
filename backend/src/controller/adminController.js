import {
  deleteContentFN,
  generateObjectId,
  insertOrUpdateContentFN,
} from '../utils/contentHelper.js';
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

export const insertAreaBatch = async (req, res) => {
  const { translations } = req.body; // alle Sprachen als Objekt

  if (!translations || Object.keys(translations).length === 0) {
    return res.status(400).json({
      success: false,
      error: { message: 'Bitte füllen sie mindestens eine Sprache aus.' },
    });
  }

  // gemeinsame Translation Group für alle Sprachen
  const groupId = generateObjectId();
  const entries = [];

  for (const [locale, data] of Object.entries(translations)) {
    const { title, description, icon, language } = data;

    if (!title || !language) continue;

    // Validierung
    const { error, value } = validatorHelperFN(
      ['areaTitle', 'description'],
      { areaTitle: title, description },
      contentSchema,
      res
    );

    if (error) {
      const returnErrorMessages = error.details.map((cur) => ({
        path: `${locale}.${cur.path.join('')}`,
        message: cur.message,
      }));

      return res.status(401).json({
        success: false,
        error: returnErrorMessages,
      });
    }

    // queryPath pro Sprache
    const queryPath = value.areaTitle
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');

    entries.push({
      translationGroup: groupId,
      language,
      title: value.areaTitle,
      description: value.description,
      icon,
      queryPath,
    });
  }

  try {
    let lastMessage = '';
    let lastReponseCode = '';
    const savedEntries = [];
    for (const entry of entries) {
      // console.log(entry);
      const response = await insertOrUpdateContentFN(
        entry,
        'area',
        'Fachgebiet erfolgreich eingefügt'
      );
      if (!response.status) {
        return res.status(response.code).json({
          success: false,
          error: { message: response.responseMessage },
        });
      }
      savedEntries.push({ _id: response._id, language: entry.language });
      lastMessage = response.responseMessage;
      lastReponseCode = response.code;
    }

    return res.status(lastReponseCode).json({
      success: true,
      message: lastMessage,
      translationGroup: groupId,
      entries: savedEntries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const insertCategoryBatch = async (req, res) => {
  const { translations } = req.body;

  if (!translations || Object.keys(translations).length === 0) {
    return res.status(400).json({
      success: false,
      error: {
        message: 'Bitte füllen Sie alles.',
      },
    });
  }

  const groupId = generateObjectId();
  const entries = [];

  for (const [locale, data] of Object.entries(translations)) {
    const { area, title, description, icon, language } = data;
    if (!title || !language) continue;

    const { error, value } = validatorHelperFN(
      ['reference', 'categoryTitle', 'description'],
      { reference: area, categoryTitle: title, description },
      contentSchema,
      res
    );

    if (error) {
      const returnErrorMessages = error.details.map((cur) => ({
        path: `${locale}.${cur.path.join('')}`,
        message: cur.message,
      }));
      return res.status(401).json({ success: false, error: returnErrorMessages });
    }

    entries.push({
      translationGroup: groupId,
      title: value.categoryTitle,
      description: value.description,
      icon,
      area,
      language,
    });
  }

  try {
    const savedEntries = [];
    let lastMessage = '';
    let lastResponseCode = '';
    for (const entry of entries) {
      const response = await insertOrUpdateContentFN(
        entry,
        'category',
        'Kategorie erfolgreich eingefügt'
      );
      if (!response.status) {
        return res
          .status(response.code)
          .json({ success: false, error: { message: response.responseMessage } });
      }
      savedEntries.push({ _id: response._id, language: entry.language });
      lastMessage = response.responseMessage;
      lastResponseCode = response.code;
    }

    return res.status(lastResponseCode).json({
      success: true,
      message: lastMessage,
      translationGroup: groupId,
      entries: savedEntries,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
};

export const updateAreaBatch = async (req, res) => {
  const { translations, translationGroup } = req.body;

  if (!translations || Object.keys(translations).length === 0) {
    return res.status(400).json({
      success: false,
      error: { message: 'Bitte füllen Sie mindestens eine Sprache aus.' },
    });
  }

  try {
    const processedEntries = [];
    let lastMessage = '';
    let lastReponseCode = '';

    for (const [locale, data] of Object.entries(translations)) {
      const { _id, title, description, icon, language } = data;

      if (!title || !language) continue;

      // Validierung
      const { error, value } = validatorHelperFN(
        ['areaTitle', 'description'],
        { areaTitle: title, description },
        contentSchema,
        res
      );

      if (error) {
        const returnErrorMessages = error.details.map((cur) => ({
          path: `${locale}.${cur.path.join('')}`,
          message: cur.message,
        }));

        return res.status(401).json({
          success: false,
          error: returnErrorMessages,
        });
      }

      // queryPath pro Sprache
      const queryPath = value.areaTitle
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-')
        .replace(/^-+/, '')
        .replace(/-+$/, '');

      const response = await insertOrUpdateContentFN(
        {
          translationGroup,
          language,
          title: value.areaTitle,
          description: value.description,
          icon,
          queryPath,
        },
        'area',
        _id ? 'Fachgebiet erfolgreich geändert' : 'Fachgebiet erfolgreich eingefügt',
        _id
      );

      if (!response.status) {
        return res.status(response.code).json({
          success: false,
          error: { message: response.responseMessage },
        });
      }

      processedEntries.push({ _id: response._id, locale });
      lastMessage = response.responseMessage;
      lastReponseCode = response.code;
    }

    return res.status(lastReponseCode).json({
      success: true,
      message: lastMessage,
      translationGroup,
      entries: processedEntries,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: { message: error.message },
    });
  }
};

export const updateCategoryBatch = async (req, res) => {
  const { translations, translationGroup } = req.body;
  if (!translations || Object.keys(translations).length === 0) {
    return res.status(400).json({
      success: false,
      error: { message: 'Bitte füllen Sie alles aus.' },
    });
  }

  const entries = [];
  for (const [locale, data] of Object.entries(translations)) {
    const { _id, area, title, description, icon, language } = data;

    console.log(area);

    if (!title || !language) continue;

    const { error, value } = validatorHelperFN(
      ['reference', 'categoryTitle', 'description'],
      { reference: area, categoryTitle: title, description },
      contentSchema,
      res
    );

    if (error) {
      const returnErrorMessages = error.details.map((cur) => ({
        path: `${locale}.${cur.path.join('')}`,
        message: cur.message,
      }));
      return res.status(401).json({ success: false, error: returnErrorMessages });
    }

    entries.push({
      _id,
      translationGroup,
      title: value.categoryTitle,
      description: value.description,
      icon,
      area,
      language,
    });
  }

  try {
    const savedEntries = [];
    let lastMessage = '';
    let lastResponseCode = '';
    for (const entry of entries) {
      const response = await insertOrUpdateContentFN(
        entry,
        'category',
        'Kategorie erfolgreich geändert',
        entry._id
      );
      if (!response.status) {
        return res
          .status(response.code)
          .json({ success: false, error: { message: response.responseMessage } });
      }
      savedEntries.push({ _id: response._id, language: entry.language });
      lastMessage = response.responseMessage;
      lastResponseCode = response.code;
    }

    return res
      .status(lastResponseCode)
      .json({ success: true, message: lastMessage, translationGroup, entries: savedEntries });
  } catch (error) {
    return res.status(500).json({ success: false, error: { message: error.message } });
  }
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

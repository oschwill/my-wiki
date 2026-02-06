import 'dotenv/config';
import mongoose from 'mongoose';
import articleModel from '../models/articleModel.js';
import userModel from '../models/userModel.js';
import areaModel from '../models/areaModel.js';
import categoryModel from '../models/categoryModel.js';
import languageModel from '../models/languageModel.js';
import connectDB from '../config/db.js';

const models = {
  article: articleModel,
  user: userModel,
  area: areaModel,
  category: categoryModel,
  language: languageModel,
};

const runMigration = async () => {
  // Parameter auslesen: node script.js [modelName] [fieldName] [defaultValue]
  const [modelName, fieldName, defaultValue] = process.argv.slice(2);

  if (!models[modelName]) {
    console.error(
      `Modell "${modelName}" nicht gefunden. Verfügbar: ${Object.keys(models).join(', ')}`,
    );
    process.exit(1);
  }

  try {
    await connectDB();

    console.log('Geladene URI:', process.env.MONGO_DB ? 'VORHANDEN' : 'NICHT GEFUNDEN');
    console.log('DB Name aus String:', process.env.MONGO_DB?.split('/')[3]?.split('?')[0]);

    const update = {};
    let val = defaultValue;
    if (val === 'true') val = true;
    if (val === 'false') val = false;
    if (val === 'null') val = null;

    update[fieldName] = val;

    let targetModel = models[modelName];

    if (targetModel && !targetModel.updateMany && targetModel.articleModel) {
      targetModel = targetModel.articleModel;
    }

    const result = await targetModel.updateMany(
      { [fieldName]: { $exists: false } },
      { $set: update },
    );

    console.log(`Erfolg: ${result.modifiedCount} Dokumente im Modell "${modelName}" aktualisiert.`);
    await mongoose.connection.close();
  } catch (err) {
    console.error('Migration fehlgeschlagen:', err);
    process.exit(1);
  }
};

runMigration();

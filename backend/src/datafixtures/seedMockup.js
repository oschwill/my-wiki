import 'dotenv/config';
import { Seeder } from 'mongo-seeding';
import path from 'path';
import { closeDB, connectForMockupDB } from '../config/db.js';
import areaModel from '../models/areaModel.js';
import articleModel from '../models/articleModel.js';
import categoryModel from '../models/categoryModel.js';

const config = {
  database: process.env.MONGO_DB,
  dropDatabase: false,
};

const seeder = new Seeder(config);
const collections = seeder.readCollectionsFromPath(path.resolve('./src/datafixtures/data'), {
  transformers: [Seeder.Transformers.replaceDocumentIdWithUnderscoreId],
});

async function seedDB() {
  try {
    // Datenbank vorher reinigen
    await connectForMockupDB();

    // Importiere die Daten
    await seeder.import(collections);

    // Hole die Referenzen aus der Datenbank
    const areas = await areaModel.find({});
    const updatedCategories = getReferenceIds('category', areas, 'area');
    await categoryModel.bulkWrite(updatedCategories);

    const categories = await categoryModel.find({});
    const updatedArticles = getReferenceIds('article', categories, 'category');
    await articleModel.bulkWrite(updatedArticles);

    console.log('Daten erfolgreich in die Datenbank eingespeist.');
  } catch (err) {
    // Bei Fehler Datenbank wieder reinigen
    await connectForMockupDB();
    console.error('Fehler beim Einfügen der Daten:', err);
  } finally {
    await closeDB();
    // Beende den Prozess
    process.exit(0);
  }
}

const getReferenceIds = (collectionName, ReferenceCollection, attribute) => {
  let updateData;
  const updatedCollections = collections
    .find((collection) => collection.name === collectionName)
    .documents.map((item) => {
      const title = item[attribute]; // Titel der Area aus dem Seed-Dokument
      const ref = ReferenceCollection.find((attr) => attr.title === title); // Finde die entsprechende unique Area aus der Datenbank

      switch (attribute) {
        case 'area':
          updateData = { area: ref._id };
          break;
        case 'category':
          updateData = { category: ref._id };
          break;

        default:
          break;
      }
      return {
        updateOne: {
          filter: { title: item.title },
          update: { $set: updateData },
          upsert: true,
        },
      };
    });

  return updatedCollections;
};

seedDB();

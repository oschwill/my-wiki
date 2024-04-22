import 'dotenv/config';
import { Seeder } from 'mongo-seeding';
import path from 'path';
import { closeDB, connectForMockupDB } from '../config/db.js';
import areaModel from '../models/areaModel.js';
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

    // Hole die Areas aus der Datenbank
    const areas = await areaModel.find({});

    // Aktualisiere die Dokumente mit den ObjectId der Areas
    const updatedCategories = collections
      .find((collection) => collection.name === 'category')
      .documents.map((category) => {
        const areaTitle = category.area; // Titel der Area aus dem Seed-Dokument
        console.log(areaTitle);
        const area = areas.find((area) => area.title === areaTitle); // Finde die entsprechende unique Area aus der Datenbank
        return {
          updateOne: {
            filter: { title: category.title },
            update: { $set: { area: area._id } },
            upsert: true,
          },
        };
      });

    // Füge die aktualisierten Kategorien in die Datenbank ein
    await categoryModel.bulkWrite(updatedCategories);

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

seedDB();

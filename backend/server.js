import { app } from './src/app.js';

// Server starten
const PORT = process.env.PORT || 9001;
const server = app.listen(PORT, () => console.log(`running on ${PORT}`));

import crypto from 'crypto';
// Funktion zum Generieren eines zufälligen Schlüssels
function generateRandomKey(length) {
  return crypto.randomBytes(length).toString('hex');
}

// Beispiel-Nutzung: Generiere einen 256-Bit-Schlüssel
const secretKey = generateRandomKey(32);
console.log('Generierter Secret Key:', secretKey);

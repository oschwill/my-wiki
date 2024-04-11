export const registerTranslator = {
  de: {
    key: {
      firstName: 'Vorname',
      lastName: 'Nachname',
      description: 'Beschreibung',
      location: 'Standort',
      password: 'Passwort',
      repeatPassword: 'Passwort Wiederholen',
      email: 'Email',
    },
    message: {
      empty: 'darf nicht leer sein',
      min: 'muss mindestens {#limit} Zeichen lang sein',
      max: 'darf maximal {#limit} Zeichen lang sein',
      email: 'Die E-Mail-Adresse ist nicht gültig.',
      base: 'muss eine Zeichenkette sein',
      pattern: 'darf nur aus alphanumerischen Werten bestehen',
      anyOnly: 'Passwörter sind nicht identisch',
      general: 'Ein unerwarteter Fehler ist aufgetreten',
      emailSend: 'Das Senden des VerifyTokens ist fehlgeschlagen',
      validate: 'Datenvalidierung fehlgeschlagen',
      noToken: 'Die Token Validierung ist fehlgeschlagen',
      noActive: 'Die Registrierung konnte nicht abgeschlossen werden',
    },
  },
};

const de = {
  my_wiki: {
    home: {
      area: {
        title: 'Fachgebiete',
        browse: 'Durchsuchen',
      },
      last_articles: 'Neueste Artikel',
      category: 'Kategorie',
    },
    my_articles: {
      administration: {
        headline: 'Artikelverwaltung',
        edit_modus: {
          headline: '✏️ Bearbeitungsmodus aktiv',
          cancel: 'Bearbeitung abbrechen',
        },
      },
      article: {
        actually_save: 'Möchtest du diesen Artikel wirklich speichern?',
        actually_reject: 'Möchtest du alle Eingaben wirklich verwerfen?',
        reject: 'Formular zurücksetzen',
        save: 'Artikel speichern',
        save_success: 'Der Artikel wurde erfolgreich gespeichert!',
        save_failed: 'Fehler beim Speichern des Artikels!',
      },
      areas: {
        failed_loading: 'Fehler beim Laden der Areas',
      },
      categories: {
        failed_loading: 'Fehler beim Laden der Kategorien',
      },
      form: {
        required_fields: {
          error: 'Bitte füllen Sie alle Pflichtfelder aus!',
        },
      },
    },
    my_profile: {
      welcome: 'Willkommen {{username}}',
      profile: {
        saved: 'Profil gespeichert',
      },
      my_account_information: {
        headline: 'Meine Benutzerdaten',
      },
      my_statistic: {
        headline: 'Meine Statistik',
        head: 'Statistiken',
        placeholder_message: 'Hier später Statistiken über Artikel, Kommentare etc.',
      },
      my_inquiries: {
        headline: 'Meine Anfragen',
        head: 'Anfragen an Webseitenbetreiber',
        placeholder: 'Hier kannst du Supportanfragen oder sonstiges senden (später noch ausbauen).',
      },
      admin_area: {
        headline: 'Adminbereich',
      },
    },
    privacy_policy: {
      headline: 'Datenschutzerklärung',
      headline_desc: `Der Schutz Ihrer persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten Ihre
        Daten daher ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TMG).`,
      responsible: {
        headline: '1. Verantwortlicher',
        text: `
              Oliver Schwill
              <br />
              E-Mail: kontakt@deinedomain.de
              `,
      },
      access_data: {
        headline: '2. Zugriffsdaten',
        text: `Beim Besuch dieser Website werden automatisch Informationen erfasst (z. B. IP-Adresse,
              Browsertyp, Uhrzeit des Zugriffs). Diese Daten dienen ausschließlich der technischen
              Überwachung und Verbesserung der Website.`,
      },
      personal_data: {
        headline: '3. Personenbezogene Daten',
        text: `Personenbezogene Daten werden nur erhoben, wenn Sie diese freiwillig zur Verfügung stellen
              (z. B. bei Registrierung oder Kontaktaufnahme).`,
      },
      cookies: {
        headline: '4. Cookies',
        text: `Diese Website verwendet Cookies, um die Benutzerfreundlichkeit zu verbessern. Sie können die
              Speicherung von Cookies in Ihrem Browser deaktivieren.`,
      },
      your_rights: {
        headline: '5. Ihre Rechte',
        text: `<li>Auskunft über Ihre gespeicherten Daten</li>
              <li>Berichtigung oder Löschung</li>
              <li>Einschränkung der Verarbeitung</li>
              <li>Widerruf erteilter Einwilligungen</li>`,
      },
      changes: {
        headline: '6. Änderungen',
        text: 'Wir behalten uns vor, diese Datenschutzerklärung bei Bedarf anzupassen.',
      },
    },
    show_single_article: {
      anonymous: 'Anonym',
      unknown: 'Unbekannt',
      edit_article: {
        text: 'Bearbeiten',
        save_success: 'Der Artikel wurde erfolgreich bearbeitet.',
        save_failed: 'Fehler beim editieren des Artikels.',
        edit_modus: {
          headline: '✏️ Bearbeitungsmodus aktiv (Fremder Artikel)',
          cancel: 'Bearbeitung abbrechen',
        },
      },
      category: 'Kategorie:',
      comment: {
        headline: 'edit_article',
        save_success: '{{backed_message}}',
        save_failed: 'Fehler beim Hinzufügen des Kommentars',
        delete_success: 'Kommentar gelöscht.',
        delete_failed: 'Kommentar konnte nicht gelöscht werden.',
      },
      loading_message: 'Artikel wird geladen...',
      no_articles: 'Artikel nicht verfügbar',
      no_articles_desc: 'Keine Artikel gefunden oder der Artikel ist nicht mehr veröffentlicht.',
      have_to_register: '(registrieren, um Profil zu sehen)',
      external_user: 'Externer Benutzer',
      created_at: 'Erstellt:',
      updated_at: 'Aktualisiert:',
      views: '{{visitors} Aufrufe}',
      pdf_export: 'PDF Export',
      share: 'Teilen',
    },
  },
} as const;

export default de;

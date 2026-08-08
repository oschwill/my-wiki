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
        headline: 'Kommentare',
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
      views: '{{visitors}} Aufrufe',
      pdf_export: 'PDF Export',
      share: 'Teilen',
    },
    terms_and_conditions: {
      headline: 'Allgemeine Geschäftsbedingungen (AGB)',
      scope_of_application: {
        headline: '1. Geltungsbereich',
        text: 'Diese AGB gelten für die Nutzung der Website „My Wiki“ in der jeweils aktuellen Fassung.',
      },
      content: {
        headline: '2. Inhalte',
        text: `Die bereitgestellten Inhalte dienen ausschließlich Informationszwecken. Für Richtigkeit,
              Vollständigkeit und Aktualität wird keine Gewähr übernommen.`,
      },
      user_accounts: {
        headline: '3. Nutzerkonten',
        text: `Nutzer sind verpflichtet, ihre Zugangsdaten vertraulich zu behandeln. Missbräuchliche
              Nutzung ist untersagt.`,
      },
      copyright: {
        headline: '4. Urheberrecht',
        text: `Alle Inhalte dieser Website unterliegen dem Urheberrecht. Eine Weiterverwendung ohne
              ausdrückliche Zustimmung ist nicht gestattet.`,
      },
      liability: {
        headline: '5. Haftung',
        text: `Es wird keine Haftung für Schäden übernommen, die durch die Nutzung oder Nichtverfügbarkeit
               der Website entstehen.`,
      },
      final_provisions: {
        headline: '6. Schlussbestimmungen',
        text: 'Es gilt das Recht der Bundesrepublik Deutschland.',
      },
    },
    user_profile: {
      loading_text: 'Profil wird geladen...',
      not_available: {
        headline: 'Profil nicht verfügbar',
        text: 'Das Profil konnte nicht gefunden werden oder ist privat.',
      },
      is_private: {
        headline: 'Profil privat',
        text: 'Dieses Profil ist privat und kann nicht eingesehen werden.',
      },
      status: 'Online',
      email: 'Email:',
      registered_at: 'Registriert am:',
      updated_at: 'Zuletzt aktualisiert:',
      articles: {
        tab: 'Artikel',
        no_articles: 'Dieser Nutzer hat noch keine Artikel veröffentlicht.',
        created_at: 'Erstellt: {{createdAt}} | Aufrufe: {{visitors}}',
      },
      statistics: {
        tab: 'Statistiken',
        number_of_items: 'Anzahl Artikel:',
        total_views: 'Gesamtaufrufe:',
      },
      message_box: {
        label: 'Nachricht an {{firstName}}',
        button: 'Nachricht senden',
        placeholder: 'Deine Nachricht...',
      },
    },
    verify_user: {
      is_verifying: 'Verifizierung läuft...',
      error: {
        failed_backed: '{{error_message}}',
        failed_frontend: 'Fehler bei der Verifizierung: {{error_message}}',
      },
    },
    wiki_browser: {
      headline: 'Fachgebiete',
      no_articles: 'Keine Artikel vorhanden',
      categories: 'Kategorien',
      no_categories: 'Keine Kategorien vorhanden',
    },
    components: {
      admin_panel: {
        loading_text: 'Benutzerdaten werden geladen...',
        no_permission: `<strong>Fehlende Berechtigung:</strong> Du musst eingeloggt sein, um das Admin-Panel zu
                        sehen.`,
        area_category: {
          headline: 'Fachgebiete / Kategorien verwalten',
          text: `Hier kannst du neue Fachgebiete und Kategorien erstellen oder bestehende
                  bearbeiten.`,
          nav_item: 'Fachgebiete und Kategorien',
        },
        user: {
          headline: 'Benutzer verwalten',
          text: 'Hier kannst du alle registrierten Benutzer verwalten.',
          nav_item: 'Mitglieder',
        },
        languages: {
          headline: 'Sprachen verwalten',
          text: 'Hier kannst du alle registrierten Benutzer verwalten.',
          nav_item: 'Sprachen und Länder',
        },
      },
      insert_new_article: {
        choose_area: 'Fachgebiet wählen:',
        choose_category: 'Kategorie wählen:',
        please_choose: 'Bitte wählen',
        title: 'Titel:',
        content: 'Inhalt:',
        article_settings: {
          headline: 'Artikel Einstellungen:',
          allow_comment: 'Kommentare erlauben',
          allow_pdf: 'PDF Export erlauben',
          allow_printing: 'Drucken erlauben',
          allow_sharing: 'Teilen erlauben',
          allow_editing: 'Bearbeitung erlauben',
          allow_show_author: 'Author anzeigen',
        },
        button: {
          save: 'Speichern',
          edit: 'Änderungen übernehmen',
          is_saving: 'Speichern...',
          reset: 'Zurücksetzen',
        },
      },
      insert_new_comment: {
        label: 'Kommentar schreiben',
        placeholder: 'Dein Kommentar...',
        possible_characters: '{{contentLength}} / {{maxContentLength}} Zeichen',
        not_registered: '(Registrieren Sie sich, um Kommentare zu verfassen)',
        button_text: 'Kommentar absenden',
      },
      show_article_list: {
        created_at: 'Erstellt: {{createdAt}}',
        updated_at: 'Aktualisiert: {{updatedAt}}',
        button_text: 'Lesen',
      },
      show_comments: {
        deleted_user: 'Gelöschter Benutzer',
        created_at: '{{createDate}} um {{createTime}} Uhr',
        button_delete_text: 'Löschen',
      },
      show_my_articles: {
        delete_article: {
          backend: '{{errorMessage}}',
          frontend: 'Fehler beim Löschen des Artikels',
        },
        publish_article_error: 'Fehler beim Veröffentlichen/Zurückziehen',
        no_articles: {
          headline: 'Keine Artikel vorhanden',
          text: `Du hast bisher noch keine Artikel erstellt. Lege deinen ersten Artikel an, um ihn hier zu
                verwalten.`,
        },
        table: {
          th_area: 'Fachgebiet',
          th_category: 'Kategorie',
          th_title: 'Titel',
          th_status: 'Status',
          th_actions: 'Aktionen',
          th_creupd_at: 'Erstellt am / Bearbeitet am',
        },
        published: 'Veröffentlicht',
        tooltip: 'Dieser Artikel ist noch nicht veröffentlicht',
        draft: 'Entwurf',
        button: {
          edit: 'Editieren',
          delete: 'Löschen',
          publish: 'Veröffentlichen',
          unpublish: 'Zurückziehen',
        },
        deleteArticleModal: {
          title: 'Artikel löschen',
          body: 'Möchtest du diesen Artikel wirklich löschen?',
          confirm: 'Löschen',
        },
        publishArticleModal: {
          title_puplish: 'Artikel veröffentlichen',
          title_unpuplish: 'Artikel zurückziehen',
          body_publish: 'Möchtest du diesen Artikel wirklich veröffentlichen',
          body_unpublish: 'Möchtest du die Veröffentlichung dieses Artikels zurückziehen?',
          confirm_publish: 'Veröffentlichen',
          confirm_unpublish: 'Zurückziehen',
        },
      },
      profile_dropdown: {
        profile: 'Profil',
        admin_area: 'Adminbereich',
        article_management: 'Artikelverwaltung',
        logout: 'Ausloggen',
      },
      sidebar: {
        link: {
          category: 'Fachgebiete',
        },
      },
      footer: {
        link: {
          terms_and_conditions: 'AGB',
          privacy_policy: 'Datenschutzrichtlinien',
        },
      },
    },
  },
} as const;

export default de;

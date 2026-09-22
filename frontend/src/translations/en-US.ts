const en = {
  my_wiki: {
    home: {
      area: {
        title: 'Subject Areas',
        browse: 'Browse',
      },
      last_articles: 'Latest Articles',
      category: 'Category',
      stats: {
        areas: 'IT Areas',
        categories: 'Area Categories',
        articles: 'Articles',
        users: 'Wiki Users',
      },
    },
    my_articles: {
      administration: {
        headline: 'Article Management',
        edit_modus: {
          headline: '✏️ Edit Mode Active',
          cancel: 'Cancel Editing',
        },
      },
      article: {
        actually_save: 'Do you really want to save this article?',
        actually_reject: 'Do you really want to discard all inputs?',
        reject: 'Reset Form',
        save: 'Save Article',
        save_success: 'The article was saved successfully!',
        save_failed: 'Error while saving the article!',
        tab: {
          create_article: 'Create an article',
          my_articles: 'My Articles',
        },
      },
      areas: {
        failed_loading: 'Error loading areas',
      },
      categories: {
        failed_loading: 'Error loading categories',
      },
      form: {
        required_fields: {
          error: 'Please fill in all required fields!',
        },
      },
    },
    my_profile: {
      welcome: 'Welcome {{username}}',
      profile: {
        saved: 'Profile saved',
      },
      my_account_information: {
        headline: 'My User Data',
      },
      my_statistic: {
        headline: 'My Statistics',
        head: 'Statistics',
        placeholder_message: 'Statistics about articles, comments, etc. will appear here later.',
      },
      my_inquiries: {
        headline: 'My Inquiries',
        head: 'Inquiries to Website Operator',
        placeholder:
          'Here you can send support inquiries or other messages (to be expanded later).',
      },
      admin_area: {
        headline: 'Admin Area',
      },
    },
    privacy_policy: {
      headline: 'Privacy Policy',
      headline_desc: `The protection of your personal data is an important concern for us. Therefore, we process your
        data exclusively on the basis of legal provisions (GDPR).`,
      responsible: {
        headline: '1. Controller',
        text: `
              Oliver Schwill
              <br />
              Email: kontakt@deinedomain.de
              `,
      },
      access_data: {
        headline: '2. Access Data',
        text: `When visiting this website, information is automatically recorded (e.g. IP address,
              browser type, time of access). This data serves exclusively for technical
              monitoring and improvement of the website.`,
      },
      personal_data: {
        headline: '3. Personal Data',
        text: `Personal data is only collected if you provide it voluntarily
              (e.g. during registration or contact).`,
      },
      cookies: {
        headline: '4. Cookies',
        text: `This website uses cookies to improve user-friendliness. You can
              disable the storage of cookies in your browser settings.`,
      },
      your_rights: {
        headline: '5. Your Rights',
        text: `<li>Information about your stored data</li>
              <li>Rectification or erasure</li>
              <li>Restriction of processing</li>
              <li>Withdrawal of granted consent</li>`,
      },
      changes: {
        headline: '6. Changes',
        text: 'We reserve the right to adapt this privacy policy if necessary.',
      },
    },
    show_single_article: {
      anonymous: 'Anonymous',
      unknown: 'Unknown',
      edit_article: {
        text: 'Edit',
        save_success: 'The article was edited successfully.',
        save_failed: 'Error editing the article.',
        edit_modus: {
          headline: '✏️ Edit Mode Active (External Article)',
          cancel: 'Cancel Editing',
        },
      },
      category: 'Category:',
      comment: {
        headline: 'Comments',
        save_success: '{{backed_message}}',
        save_failed: 'Error adding the comment',
        delete_success: 'Comment deleted.',
        delete_failed: 'Comment could not be deleted.',
      },
      loading_message: 'Loading article...',
      no_articles: 'Article not available',
      no_articles_desc: 'No articles found or the article is no longer published.',
      have_to_register: '(register to view profile)',
      external_user: 'External User',
      created_at: 'Created:',
      updated_at: 'Updated:',
      views: '{{visitors}} views',
      pdf_export: 'PDF Export',
      share: 'Share',
    },
    terms_and_conditions: {
      headline: 'Terms and Conditions (T&C)',
      scope_of_application: {
        headline: '1. Scope of Application',
        text: 'These terms apply to the use of the "My Wiki" website in its currently valid version.',
      },
      content: {
        headline: '2. Content',
        text: `The content provided is for informational purposes only. No warranty
              is assumed for correctness, completeness, and timeliness.`,
      },
      user_accounts: {
        headline: '3. User Accounts',
        text: `Users are obligated to treat their access data confidentially. Abusive
              use is prohibited.`,
      },
      copyright: {
        headline: '4. Copyright',
        text: `All content on this website is subject to copyright law. Any further use without
              express consent is not permitted.`,
      },
      liability: {
        headline: '5. Liability',
        text: `No liability is assumed for damages resulting from the use or unavailability
               of the website.`,
      },
      final_provisions: {
        headline: '6. Final Provisions',
        text: 'The law of the Federal Republic of Germany applies.',
      },
    },
    user_profile: {
      loading_text: 'Loading profile...',
      not_available: {
        headline: 'Profile not available',
        text: 'The profile could not be found or is private.',
      },
      is_private: {
        headline: 'Private Profile',
        text: 'This profile is private and cannot be viewed.',
      },
      location: 'Location',
      status: 'Online',
      email: 'Email:',
      registered_at: 'Registered on:',
      updated_at: 'Last updated:',
      articles: {
        tab: 'Articles',
        no_articles: 'This user has not published any articles yet.',
        created_at: 'Created: {{createdAt}} | Views: {{visitors}}',
      },
      statistics: {
        tab: 'Statistics',
        number_of_items: 'Number of articles:',
        total_views: 'Total views:',
      },
      message_box: {
        label: 'Message to {{firstName}}',
        button: 'Send message',
        placeholder: 'Your message...',
        sending: 'Sending message...',
        empty_message: 'Your message must contain text',
        send_success: 'Your message to {{userName}} was sent successfully',
        send_failed: 'Failed to send the message',
        possible_characters: '{{contentLength}}/{{maxContentLength}} characters',
        confirm: {
          title: 'Send message',
          text: 'Do you really want to send this message to {{userName}}?',
          confirm_text: 'Send message',
          cancel_text: 'Cancel',
        },
        errors: {
          profile_message: {
            recipient: {
              required: 'Recipient is required.',
              invalid: 'The recipient is invalid.',
            },
            message: {
              required: 'Message is required.',
              min: 'The message must contain at least 1 character.',
              max: 'The message may contain a maximum of 1000 characters.',
            },
          },
        },
      },
    },
    verify_user: {
      is_verifying: 'Verification in progress...',
      error: {
        failed_backed: '{{error_message}}',
        failed_frontend: 'Verification error: {{error_message}}',
      },
    },
    wiki_browser: {
      headline: 'Subject Areas',
      no_articles: 'No articles available',
      categories: 'Categories',
      no_categories: 'No categories available',
      items_per_page: 'Items per page',
    },
    payload_page: {
      page_not_found: 'Page not found',
    },
    data: {
      countries: {
        DE: 'Germany',
        US: 'United States',
        CN: 'China',
        IN: 'India',
        JP: 'Japan',
        GB: 'United Kingdom',
        FR: 'France',
        IT: 'Italy',
        ES: 'Spain',
        BR: 'Brazil',
        RU: 'Russia',
        CA: 'Canada',
        AU: 'Australia',
        KR: 'South Korea',
        MX: 'Mexico',
        ID: 'Indonesia',
        TR: 'Turkey',
        NL: 'Netherlands',
        SA: 'Saudi Arabia',
        CH: 'Switzerland',
        SE: 'Sweden',
        PL: 'Poland',
        BE: 'Belgium',
        AR: 'Argentina',
        AT: 'Austria',
        ZA: 'South Africa',
        NO: 'Norway',
        DK: 'Denmark',
        FI: 'Finland',
        IE: 'Ireland',
      },
    },
    components: {
      admin_panel: {
        loading_text: 'Loading user data...',
        no_permission: `<strong>Missing permission:</strong> You must be logged in to see the admin panel.`,
        area_category: {
          headline: 'Manage Subject Areas / Categories',
          text: `Here you can create new subject areas and categories or edit existing ones.`,
          nav_item: 'Areas and Categories',
        },
        user: {
          headline: 'Manage Users',
          text: 'Here you can manage all registered users.',
          nav_item: 'Members',
        },
        languages: {
          headline: 'Manage Languages',
          text: 'Here you can manage all registered users.',
          nav_item: 'Languages and Countries',
        },
      },
      header: {
        create_article: 'Create Article',
        unread_messages: 'Unread Messages',
        login: 'Login',
      },
      login_user: {
        headline: 'Login',
        message_success: 'Successfully logged in! Welcome back 👋',
        message_failed: '{{errorMessage}}',
        message_failed_fallback: 'Login failed: {{errorMessage}}',
        login_stay_label: 'Stay logged in',
        forgot_password: 'Forgot your password?',
        login_google: 'Login with Google',
        login_github: 'Login with GitHub',
        login_or: '- OR -',
        register: 'Register',
        password: 'Password',
        email: 'Email',
        login_button: 'Log in',
        is_login: 'Log in...',
      },
      register_user: {
        error_message: '{{errorMessage}}',
        error_message_fallback: 'Registration failed: {{errorMessage}}',
        register: 'Registration',
        is_registering: 'Registration is in progress...',
        first_name: 'First Name*',
        last_name: 'Last Name*',
        username: 'Username',
        email: 'Email*',
        country: 'Country*',
        password: 'Password*',
        repeat_password: 'Repeat Password*',
        go_register: 'Register',
        to_login: 'Back to Login',
        email_test_notice: `
              <strong>Note:</strong> This demo currently uses a test sender for technical purposes.
              Confirmation emails are sent from <strong>admin.mywiki@11889569.brevosend.com</strong>.
        `,
      },
      my_user_data: {
        upload_text: `Drag your profile picture here or click to select a file (only jpg and png images are supported)`,
        change_password: 'Change password',
        request_change_password: 'Request password change',
        change_email: 'Change email',
        request_change_email: 'Request email change',
        data: 'Personal information',
        first_name: 'First name*',
        last_name: 'Last name*',
        country: 'Country*',
        description: 'Description',
        wiki_settings: 'Wiki settings',
        allow_messages: 'Allow messages',
        notify_on_new_articles: 'Notifications for new articles',
        email_notify_on_new_articles: 'Email notifications for new articles',
        two_factor_auth: 'Enable two-factor authentication',
        save: 'Save',
        saving: 'Saving...',
        image_alt: 'Profile picture preview',
        is_profile_private: 'Make profile private',
        is_email_private: 'Make email private',
        load_payload_content: 'Page is loading...',
      },
      user_list: {
        table: {
          user: 'User',
          email: 'E-mail',
          firstname: 'First name',
          lastname: 'Last name',
          location: 'Location',
          role: 'Role',
          provider: 'Provider',
          active: 'Active',
          create_request_status: {
            label: 'Creator request',
            accepted: 'Accepted',
            pending: 'Pending',
            rejected: 'Rejected',
            none: 'None',
          },
          is_user_active: 'Yes',
          is_user_not_active: 'No',
        },
        call_to_action: {
          change_role: 'Change role',
          delete: 'Delete',
          login_status_disable: 'Block',
          login_status_enable: 'Unblock',
        },
        delete_user_message: {
          title: 'Delete user',
          message: `Are you sure you want to delete the user <strong>{{userToDelete}}</strong>?`,
          confirm_text: 'Delete',
          cancel_text: 'Cancel',
          delete_success: 'User was successfully deleted.',
        },
        login_status_success: 'User {{email}} was {{status}}.',
        role_status_success: 'The user role for {{email}} was successfully changed.',
        load_user_error: 'Error loading users!',
        blocked: 'blocked',
        activated: 'activated',
      },
      insert_new_article: {
        choose_area: 'Select subject area:',
        choose_category: 'Select category:',
        please_choose: 'Please select',
        title: 'Title:',
        content: 'Content:',
        article_settings: {
          headline: 'Article Settings:',
          allow_comment: 'Allow comments',
          allow_pdf: 'Allow PDF export',
          allow_printing: 'Allow printing',
          allow_sharing: 'Allow sharing',
          allow_editing: 'Allow editing',
          allow_show_author: 'Show author',
        },
        button: {
          save: 'Save',
          edit: 'Apply Changes',
          is_saving: 'Saving...',
          reset: 'Reset',
        },
      },
      insert_new_comment: {
        label: 'Write a comment',
        placeholder: 'Your comment...',
        possible_characters: '{{contentLength}} / {{maxContentLength}} characters',
        not_registered: '(Register to write comments)',
        button_text: 'Submit Comment',
      },
      show_article_list: {
        created_at: 'Created: {{createdAt}}',
        updated_at: 'Updated: {{updatedAt}}',
        button_text: 'Read',
      },
      show_comments: {
        deleted_user: 'Deleted User',
        created_at: '{{createDate}} at {{createTime}}',
        button_delete_text: 'Delete',
      },
      show_my_articles: {
        delete_article: {
          backend: '{{errorMessage}}',
          frontend: 'Error deleting the article',
        },
        publish_article_error: 'Error publishing/unpublishing',
        no_articles: {
          headline: 'No articles available',
          text: `You have not created any articles yet. Create your first article to manage it here.`,
        },
        table: {
          th_area: 'Subject Area',
          th_category: 'Category',
          th_title: 'Title',
          th_status: 'Status',
          th_actions: 'Actions',
          th_creupd_at: 'Created at / Edited at',
        },
        published: 'Published',
        tooltip: 'This article is not yet published',
        draft: 'Draft',
        button: {
          edit: 'Edit',
          delete: 'Delete',
          publish: 'Publish',
          unpublish: 'Unpublish',
        },
        deleteArticleModal: {
          title: 'Delete Article',
          body: 'Do you really want to delete this article?',
          confirm: 'Delete',
        },
        publishArticleModal: {
          title_puplish: 'Publish Article',
          title_unpuplish: 'Unpublish Article',
          body_publish: 'Do you really want to publish this article?',
          body_unpublish: 'Do you really want to unpublish this article?',
          confirm_publish: 'Publish',
          confirm_unpublish: 'Unpublish',
        },
      },
      messaging_list: {
        headline: 'Your Messages',
        text: 'Here you can view and manage your messages',
        open_article: 'Go to Article',
        comment_title: 'New Comment',
        creator_title: 'Become a Creator',
        upgrade_creator_message: 'The user {{username}} would like to be upgraded to a Creator',
        open_member_list: 'Go to Member List',
        comment_created: {
          message:
            'A new comment has been posted on your article "{{articleTitle}}":\n\n"{{commentContent}}"',
        },
        my_inquiries: {
          no_messages: 'You currently have no messages',
        },
        creator_request_accepted_title: 'Creator Request Accepted',
        creator_request_accepted_message:
          'Your request has been accepted. You have been upgraded to Creator and can now create your own articles. If you do not see the option to create articles yet, please log out and log in again.',
        create_article: 'Create Your First Article',
        profile_message_title: 'You Have Received a User Message',
        message_types: {
          profile_message: 'User Message',
          comment_created: 'Article Comment',
          creator_request: 'Request',
          creator_request_accepted: 'Request Accepted',
          creator_request_rejected: 'Request Rejected',
          system: 'System',
        },
      },
      upgrade_to_creator_button: {
        title: 'Become a Creator',
        description:
          'Would you like to become a Creator? As a Creator, you can write your own articles and share your knowledge with the community.',
        request: 'Request Creator status',
        requested: 'Request sent',
        confirm:
          'Would you like to submit a request to become a Creator? As a Creator, you can write your own articles.',
        cancel: 'Cancel',
        confirm_button: 'Send request',
        info: 'Would you like to write your own articles? Submit your request here to become a Creator.',
        close: 'Close notice',
        success: 'Your Creator request has been sent successfully.',
        failed: 'Your Creator request failed.',
      },
      profile_dropdown: {
        profile: 'Profile',
        admin_area: 'Admin Area',
        article_management: 'Product Management',
        logout: 'Logout',
      },
      sidebar: {
        link: {
          category: 'Areas',
        },
      },
      footer: {
        link: {
          terms_and_conditions: 'Terms and Conditions',
          privacy_policy: 'Privacy Policy',
        },
      },
    },
    system: {
      user_sender: 'My Wiki System',
      loading_longer: `The server is currently starting up. After a long period of inactivity, the first request
                may take a little longer.`,
    },
  },
} as const;

export default en;

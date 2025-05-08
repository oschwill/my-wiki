import { LoginFormState, RegisterFormState, UserProfileFormState } from '../dataTypes/types';

export const checkRegisterUserCredentials = (formData: RegisterFormState): object => {
  const errors: Partial<Record<keyof RegisterFormState, string>> = {};

  if (!formData.firstName.value) errors.firstName = 'Vorname ist erforderlich';
  if (!formData.lastName.value) errors.lastName = 'Nachname ist erforderlich';

  if (!formData.email.value) errors.email = 'E-Mail ist erforderlich';
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.value))
    errors.email = 'Ungültige E-Mail-Adresse';

  if (!formData.password.value) errors.password = 'Passwort ist erforderlich';
  else if (formData.password.value.length < 8)
    errors.password = 'Passwort zu kurz (min. 8 Zeichen)';

  if (!formData.repeatPassword.value) errors.repeatPassword = 'Bitte Passwort wiederholen';
  else if (formData.repeatPassword.value !== formData.password.value)
    errors.repeatPassword = 'Passwörter stimmen nicht überein';

  if (!formData.location.value) errors.location = 'Land ist erforderlich';

  return errors;
};

export const checkLoginUserCredentials = (formData: LoginFormState): object => {
  const errors: Partial<Record<keyof LoginFormState, string>> = {};

  if (!formData.email.value) errors.email = 'E-Mail ist erforderlich';

  if (!formData.password.value) errors.password = 'Passwort ist erforderlich';

  return errors;
};

export const checkMyUserProfileData = (formData: UserProfileFormState): object => {
  const errors: Partial<Record<keyof UserProfileFormState, string>> = {};

  if (!formData.firstName.value) errors.firstName = 'Vorname ist erforderlich';
  if (!formData.lastName.value) errors.lastName = 'Nachname ist erforderlich';
  if (!formData.location.value) errors.location = 'Land ist erforderlich';
  if (typeof formData.twoFactorAuth.value !== 'boolean')
    errors.twoFactorAuth = 'Ein unerwarteter Fehler ist aufgetreten';
  if (typeof formData.loginVerifyToken.value !== 'boolean')
    errors.loginVerifyToken = 'Ein unerwarteter Fehler ist aufgetreten';
  if (typeof formData.notifyOnNewArticles.value !== 'boolean')
    errors.notifyOnNewArticles = 'Ein unerwarteter Fehler ist aufgetreten';
  if (typeof formData.emailNotifyOnNewArticles.value !== 'boolean')
    errors.emailNotifyOnNewArticles = 'Ein unerwarteter Fehler ist aufgetreten';
  if (typeof formData.allowMessages.value !== 'boolean')
    errors.allowMessages = 'Ein unerwarteter Fehler ist aufgetreten';
  if (typeof formData.isProfilePrivate.value !== 'boolean')
    errors.isProfilePrivate = 'Ein unerwarteter Fehler ist aufgetreten';

  return errors;
};

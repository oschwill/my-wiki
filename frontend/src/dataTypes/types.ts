import { BaseFormField, GenericFormState, ImageDataField, ToggleDataField } from './baseTypes';

export interface RegisterFields {
  firstName: BaseFormField;
  lastName: BaseFormField;
  username: BaseFormField;
  email: BaseFormField;
  password: BaseFormField;
  repeatPassword: BaseFormField;
  location: BaseFormField;
  ipAddress: BaseFormField;
  [key: string]: BaseFormField; // Dies ist die Index-Signatur, die sicherstellt, dass alle Felder vom Typ string sind
}

export interface LoginFields {
  email: BaseFormField;
  password: BaseFormField;
  loginStay: BaseFormField;
  [key: string]: BaseFormField;
}

export interface UserProfileFields {
  firstName: BaseFormField;
  lastName: BaseFormField;
  userName: BaseFormField;
  location: BaseFormField;
  description: BaseFormField;
  profileImage: ImageDataField;
  originalProfileImage: ImageDataField;
  twoFactorAuth: ToggleDataField;
  loginVerifyToken: ToggleDataField;
  notifyOnNewArticles: ToggleDataField;
  emailNotifyOnNewArticles: ToggleDataField;
  allowMessages: ToggleDataField;
  isProfilePrivate: ToggleDataField;
  [key: string]: BaseFormField | ImageDataField | ToggleDataField;
}

export type RegisterFormState = GenericFormState<RegisterFields>;
export type LoginFormState = GenericFormState<LoginFields>;
export type UserProfileFormState = GenericFormState<UserProfileFields>;
export type HasNameFields = { firstName: string; lastName: string };
export type ResponsiveColSize =
  | true
  | 'auto'
  | number
  | { span?: number | 'auto'; offset?: number; order?: number };
export type User = {
  userId: string;
  email: string;
  username?: string;
  role: string;
  profileImage: string;
};
export type AuthContextProps = {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  authToken: string | null;
  setAuthToken: (authToken: string | null) => void;
  refreshUser: () => Promise<void>;
};

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
  isEmailPrivate: ToggleDataField;
  [key: string]: BaseFormField | ImageDataField | ToggleDataField;
}

export interface UserListFromApi {
  _id: string;
  role: string;
  firstName: string;
  lastName: string;
  location: string;
  email: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  ipAdress: string;
  username: string;
  provider: string;
}

export interface SortConfig<T> {
  key: keyof T;
  direction: 'asc' | 'desc';
}

export interface CategoryFromApi {
  _id: string;
  title: string;
  description: string;

  area: {
    _id: string;
    title: string;
    description: string;
    icon: string;
    queryPath: string;
  };

  language: {
    _id: string;
    label: string;
    locale: string;
  };

  translationGroup: string;
}

export interface Category {
  _id: string;
  title: string;
  description: string;
  area: string;
  language: {
    _id: string;
    label: string;
    locale: string;
  };
  translationGroup: string;
}

export interface Language {
  _id: string;
  locale: string;
  label: string;
  enabled: boolean;
}

/* LANGUAGE AND AREAS OUTPUT */
export interface LanguageSchema {
  _id: string;
  key: string;
  label: string;
  locale: string;
  country: string;
  enabled: boolean;
}

export interface Area {
  _id: string;
  translationGroup: string;
  title: string;
  description: string;
  queryPath: string;
  icon: string;
  language: LanguageSchema;
}

export interface ArticleCategory {
  _id: string;
  title: string;
  queryPath: string;
}

export interface ArticleListItem {
  _id: string;
  title: string;
  content: string;
  category: ArticleCategory;
  createdAt: string;
  updatedAt?: string | null;
}

// ================= Backend Profile Interfaces =================
export interface ArticleCategoryBackend {
  _id: string;
  title: string;
  queryPath: string;
  area: {
    _id: string;
    title: string;
    icon: string | null;
    queryPath: string;
  };
}

export interface ArticleBackend {
  _id: string;
  title: string;
  createdAt: string;
  updatedAt?: string | null;
  visitors: number;
  category: ArticleCategoryBackend;
}

export interface UserProfileBackend {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;
  email?: string;
  description?: string;
  location?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt?: string | null;
  isOnline?: boolean;
  allowMessages?: boolean;
  isProfilePrivate?: boolean;
  isEmailPrivate?: boolean;
  articles: ArticleBackend[];
}

export type ViewMode = 'grid' | 'list';

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

/* INSERT OR UPDATE ARTICLE PROPS */
export type ArticleFieldErrors = {
  area?: boolean;
  category?: boolean;
  title?: boolean;
  content?: boolean;
};

export type ArticleFeatureFlags = {
  allowCommentsection: boolean;
  allowExportToPDF: boolean;
  allowPrinting: boolean;
  allowSharing: boolean;
  allowEditing: boolean;
};

export interface InsertNewArticleProps {
  areas: any[];
  categories: any[];
  selectedArea: string;
  selectedCategory: string;
  title: string;
  errors: ArticleFieldErrors;
  featureFlags: ArticleFeatureFlags;

  loadingCategories: boolean;
  submitting: boolean;

  editorRef: React.MutableRefObject<any>;

  onAreaChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onContentChange: (value: string) => void;
  onFlagChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

  onSaveClick: () => void;
  onResetClick: () => void;
}

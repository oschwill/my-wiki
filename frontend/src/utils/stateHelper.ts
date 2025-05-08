import { GenericFormState } from '../dataTypes/baseTypes';
import {
  HasNameFields,
  LoginFormState,
  RegisterFormState,
  UserProfileFormState,
} from '../dataTypes/types';

export const initialRegisterUserFormState: RegisterFormState = {
  firstName: { value: '', error: '' },
  lastName: { value: '', error: '' },
  username: { value: '', error: '' },
  email: { value: '', error: '' },
  password: { value: '', error: '' },
  repeatPassword: { value: '', error: '' },
  location: { value: '', error: '' },
  ipAddress: { value: '', error: '' },
};

export const initialLoginUserFormState: LoginFormState = {
  email: { value: '', error: '' },
  password: { value: '', error: '' },
  loginStay: { value: '0', error: '' },
};

export const initialUserProfileFormState: UserProfileFormState = {
  firstName: { value: '', error: '' },
  lastName: { value: '', error: '' },
  userName: { value: '', error: '' },
  location: { value: '', error: '' },
  description: { value: '', error: '' },
  profileImage: { value: null, error: '' },
  originalProfileImage: { value: null, error: '' },
  twoFactorAuth: { value: false, error: '' },
  loginVerifyToken: { value: false, error: '' },
  notifyOnNewArticles: { value: false, error: '' },
  emailNotifyOnNewArticles: { value: false, error: '' },
  allowMessages: { value: false, error: '' },
  isProfilePrivate: { value: false, error: '' },
};

type GenericFormAction<T> =
  | { type: 'SET_FIELD'; field: keyof T; value: any }
  | { type: 'SET_MULTIPLE_FIELDS'; values: Partial<T> }
  | { type: 'RESET'; initialState: T }
  | { type: 'SET_ERRORS'; errors: Partial<Record<keyof T, string>> }
  | (T extends HasNameFields
      ? { type: 'AUTO_GENERATE_USERNAME'; generator?: (state: T) => string }
      : never);

export function genericFormReducer<T extends GenericFormState<T>>(
  state: T,
  action: GenericFormAction<T> // Was wir dispatchen
): T {
  switch (action.type) {
    case 'SET_FIELD':
      return {
        ...state,
        [action.field]: {
          ...state[action.field],
          value: action.value,
          error: '',
        },
      };
    case 'SET_MULTIPLE_FIELDS':
      return {
        ...state,
        ...action.values,
      };
    case 'RESET':
      return action.initialState;
    case 'AUTO_GENERATE_USERNAME':
      if (isRegisterFormState(state)) {
        const firstName = (state as RegisterFormState).firstName.value[0] || '';
        const lastName = (state as RegisterFormState).lastName.value;
        const defaultUsername = (firstName + lastName || '').toLowerCase();

        return {
          ...state,
          username: {
            value: action.generator ? action.generator(state as any) : defaultUsername,
            error: '',
          },
        };
      }
      return state;
    case 'SET_ERRORS': {
      const updated = { ...state };
      for (const key in action.errors) {
        if (key in updated) {
          updated[key] = {
            ...updated[key],
            error: action.errors[key],
          };
        }
      }
      return updated;
    }
    default:
      return state;
  }
}

/* TYPE GUARD */
export function isRegisterFormState(state: any): state is RegisterFormState {
  return state.firstName && state.lastName;
}

/* data Helper Function */
export const mapUserToFormData = (user: any): Partial<UserProfileFormState> => {
  return {
    firstName: { value: user.firstName || '', error: '' },
    lastName: { value: user.lastName || '', error: '' },
    userName: { value: user.username || '', error: '' },
    location: { value: user.location || '', error: '' },
    description: { value: user.description || '', error: '' },
    profileImage: { value: user.profileImage || null, error: '' },
    twoFactorAuth: { value: user.twoFactorAuth || false, error: '' },
    notifyOnNewArticles: { value: user.notifyOnNewArticles || false, error: '' },
    emailNotifyOnNewArticles: { value: user.emailNotifyOnNewArticles || false, error: '' },
    allowMessages: { value: user.allowMessages || false, error: '' },
    isProfilePrivate: { value: user.isProfilePrivate || false, error: '' },
  };
};

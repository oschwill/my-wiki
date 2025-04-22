import { GenericFormState } from '../dataTypes/baseTypes';
import { HasNameFields, RegisterFormState } from '../dataTypes/types';

export const initialRegisterUserFormState: RegisterFormState = {
  firstName: { value: '', error: '' },
  lastName: { value: '', error: '' },
  username: { value: '', error: '' },
  email: { value: '', error: '' },
  password: { value: '', error: '' },
  repeatPassword: { value: '', error: '' },
  location: { value: '', error: '' },
};

type GenericFormAction<T> =
  | { type: 'SET_FIELD'; field: keyof T; value: string }
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

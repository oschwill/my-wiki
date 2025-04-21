import { GenericFormState } from '../dataTypes/baseTypes';
import { HasNameFields, RegisterFormState } from '../dataTypes/types';

export const initialRegisterUserFormState: RegisterFormState = {
  firstName: '',
  lastName: '',
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
  country: '',
};

type GenericFormAction<T> =
  | { type: 'SET_FIELD'; field: keyof T; value: string }
  | { type: 'SET_MULTIPLE_FIELDS'; values: Partial<T> }
  | { type: 'RESET'; initialState: T }
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
        [action.field]: action.value,
      };
    case 'SET_MULTIPLE_FIELDS':
      return {
        ...state,
        ...action.values,
      };
    case 'RESET':
      return action.initialState;
    case 'AUTO_GENERATE_USERNAME':
      if (
        'firstName' in state &&
        'lastName' in state &&
        typeof state.firstName === 'string' &&
        typeof state.lastName === 'string'
      ) {
        const defaultUsername =
          (state.firstName[0]?.toLowerCase() || '') +
          ((state.lastName as string) || '').toLowerCase();

        return {
          ...state,
          username: action.generator ? action.generator(state as any) : defaultUsername,
        };
      }
      return state;
    default:
      return state;
  }
}

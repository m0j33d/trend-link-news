import {
  LOGIN_USER,
  SET_USER,
  SET_ALERT_DETAILS,
  SET_LOGGED_IN,
  RESET
} from "./types";

export const initialState = {
  api_host: process.env.REACT_APP_BACKEND_URL,
  user: null,
  user_token: null,
  logged_in: false,
  alert_details: null,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case RESET:
      return initialState;
    case LOGIN_USER:
      console.log( action.payload)
      return {
        ...state,
        user_token: action.payload,
        logged_in: true,
      };
    case SET_USER:
      return {
        ...state,
        user: action.payload,
      };
    case SET_ALERT_DETAILS:
      return {
        ...state,
        alert_details: action.payload,
      };
    case SET_LOGGED_IN:
      return {
        ...state,
        logged_in: action.payload,
      };
    default:
      return state;
  }
}
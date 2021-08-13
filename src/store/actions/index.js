import { AUTH_USER, LOGOUT_USER } from "../types";

import * as api from "../../api/index";

export const registerUser = (userData) => ({
  type: AUTH_USER,
  payload: api.registerUser(userData),
});

export const loginUser = (userData) => ({
  type: AUTH_USER,
  payload: api.loginUser(userData),
});

export const autoSignIn = (userData) => ({
  type: AUTH_USER,
  payload: api.autoSignIn(userData),
});

export const logoutUser = (userData) => ({
  type: LOGOUT_USER,
  payload: api.logoutUser(userData),
});

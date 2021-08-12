import { AUTH_USER } from "../types";

import * as api from "../../api/index";

export const registerUser = (userData) => ({
  type: AUTH_USER,
  payload: api.registerUser(userData),
});

export const loginUser = () => {
  return {
    value: true,
  };
};

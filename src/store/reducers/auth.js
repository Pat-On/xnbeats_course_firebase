const INITIAL_STATE = {
  isAuth: false,
  user: null,
  checkingAuth: false,
};

export default function (state = INITIAL_STATE, action) {
  switch (action.type) {
    default:
      return state;
  }
}

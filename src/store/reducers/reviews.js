import { ADD_REVIEW, CLEAR_REVIEW } from "../types";

export default function (state = {}, action) {
  switch (action.type) {
    case ADD_REVIEW:
      return { ...state, addedReview: action.payload };
    case CLEAR_REVIEW:
      return { addedReview: action.payload };
    default:
      return state;
  }
}

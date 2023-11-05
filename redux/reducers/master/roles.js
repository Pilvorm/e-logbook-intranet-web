import { GET_ALL_ROLES, RE_GET_ROLES } from "redux/types";

const initialState = {
  data: [],
};

const masterRoleReducers = (state = initialState, action) => {
  switch (action.type) {
    case GET_ALL_ROLES:
      return {
        ...state,
        data: action.payload.data,
      };
    case RE_GET_ROLES:
      return {
        data: action.payload.data,
      };
    default:
      return state;
  }
};

export default masterRoleReducers;

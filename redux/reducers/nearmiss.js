import {
  DELETE_NEARMISS,
  EDIT_NEARMISS,
  GET_ALL_NEARMISS,
  GET_ALL_NEARMISS_BY_ID,
  SAVE_NEARMISS,
} from "redux/types";

const initialState = {
  data: [],
  currentPage: 0,
  totalPage: 0,
  pageSize: 0,
};

export default function masterNearmissReducers(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_NEARMISS:
      return {
        ...state,
        data: action.payload.data,
        currentPage: action.payload.currentPage,
        totalPage: action.payload.totalPage,
        pageSize: action.payload.pageSize,
        totalData: action.payload.totalData,
      };

    case GET_ALL_NEARMISS_BY_ID:
      return action.payload;

    case SAVE_NEARMISS:
      return action.payload;

    case DELETE_NEARMISS:
      return action.payload;
    // case CREATE_MASTER_AREA:
    //   return action.payload;

    default:
      return state;
  }
}

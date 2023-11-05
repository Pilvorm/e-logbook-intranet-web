import { GET_ALL_MASTER_LOKASI, GET_MASTER_LOKASI_BY_ID } from "redux/types";

const initialState = {
  data: [],
  currentPage: 0,
  totalPage: 0,
  pageSize: 0,
};

export default function masterLokasiReducers(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_MASTER_LOKASI:
      return {
        ...state,
        data: action.payload.data,
        currentPage: action.payload.currentPage,
        totalPage: action.payload.totalPage,
        pageSize: action.payload.pageSize,
        totalData: action.payload.totalData,
      };
    // case DELETE_MASTER_AREA:
    //   return action.payload;
    // case CREATE_MASTER_AREA:
    //   return action.payload;
    // case EDIT_MASTER_AREA:
    //   return action.payload;
    default:
      return state;
  }
}

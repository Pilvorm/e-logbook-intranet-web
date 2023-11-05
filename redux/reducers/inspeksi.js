import { GET_ALL_INSPEKSI, GET_ALL_INSPEKSI_BY_ID } from "redux/types";

const initialState = {
  data: [],
  currentPage: 0,
  totalPage: 0,
  pageSize: 0,
};

export default function inspeksiReducer(state = initialState, action) {
  switch (action.type) {
    case GET_ALL_INSPEKSI:
      return {
        ...state,
        data: action.payload.data,
        currentPage: action.payload.currentPage,
        totalPage: action.payload.totalPage,
        pageSize: action.payload.pageSize,
        totalData: action.payload.totalData,
      };

    case GET_ALL_INSPEKSI_BY_ID:
      console.log(action.payload);
      return action.payload;

    default:
      return state;
  }
}

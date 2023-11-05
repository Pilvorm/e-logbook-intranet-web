import {
  GET_ALL_BAGIAN_TUBUH_YANG_TERLUKA,
  GET_ALL_BAGIAN_TUBUH_YANG_TERLUKA_BY_ID,
} from "redux/types";

const initialState = {
  data: [],
  currentPage: 0,
  totalPage: 0,
  pageSize: 0,
};

export default function masterBagianTubuhYangTerlukaReducers(
  state = initialState,
  action
) {
  switch (action.type) {
    case GET_ALL_BAGIAN_TUBUH_YANG_TERLUKA:
      return {
        ...state,
        data: action.payload.data,
        currentPage: action.payload.currentPage,
        totalPage: action.payload.totalPage,
        pageSize: action.payload.pageSize,
        totalData: action.payload.totalData,
      };

    case GET_ALL_BAGIAN_TUBUH_YANG_TERLUKA_BY_ID:
      return action.payload;

    default:
      return state;
  }
}

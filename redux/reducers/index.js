import { combineReducers } from "redux";

import authReducers from "redux/reducers/auth";
import masterUserReducers from "./master/user";
import masterRoleReducers from "./master/roles";

import userProfileReducer from "./userProfile";

export default combineReducers({
  authReducers,
  masterUserReducers,
  masterRoleReducers,
  userProfileReducer,
});

import { combineReducers } from "redux";
import handleAPIState from "./apiReducer";
import handleAuthState from "./authReducer";
import handleMusicState from "./musicReducer";

export default combineReducers({
    apiState: handleAPIState,
    authState: handleAuthState,
    musicState: handleMusicState
})
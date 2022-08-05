import Cookies from 'js-cookie';
import { SET_ACCOUNT_INFO, SET_LOGIN } from '../constants';

const authInitState = {
    token: Cookies.get('token') || false,
    role: Cookies.get('role') || false, 
    accountInfo: null,
}


const handleAuthState = (state =  authInitState, action) => {
    switch(action.type) {
        case SET_LOGIN:
            return {
                ...state,
                token: action.payload.token,
                role: action.payload.role
            }
        case SET_ACCOUNT_INFO:
            return {
                ...state,
                accountInfo: action.payload
            }
        default:
            return state;
    }
}

export default handleAuthState;
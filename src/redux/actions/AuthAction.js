import Cookies from "js-cookie";
import { SET_LOGIN } from "../constants";
import ApiAction from "./ApiAction";

class AuthAction extends ApiAction {

    actSetLogin(data) {
        return {
            type: SET_LOGIN,
            payload: data
        }
    }

    async asyncLogout() {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            await dispatch(this.callApi('logout', 'post', { token }, null, null));
            dispatch(this.actSetLogout());
            dispatch(this.actSetAccountInfo(null));
        }
    }

    async asyncLogin(payload) {
        return async (dispatch) => {
            const response = await dispatch(this.callApi("login", "post", null, null, payload));
            if(response.status === 200) {
                Cookies.set('token', response.data.data.token, { expires: 2 });
                Cookies.set('role', response.data.data.role, { expires: 2 });
                dispatch(this.actSetLogin({ ...response.data.data }));
            }
            return response;
        }
    }

    async asyncRegister(payload) {
        return async (dispatch) => {
            const response = await dispatch(this.callApi("account", "post", null, null, payload));
            return response;
        }
    }

    async asyncGetAccountInfo(role) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi("account/owner", "get", { token }, null, null));
            if(response.data.data?.role !== role || response.status === 401) {
                dispatch(this.actSetLogout());
                return false;
            }
            if(response.status === 200) {
                dispatch(this.actSetAccountInfo(response.data.data));
                return true;
            }
        }
    }
}

export default new AuthAction();
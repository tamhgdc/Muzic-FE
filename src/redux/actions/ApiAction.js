import { callAPI } from "../../apis";
import Cookies from "js-cookie";
import ReactNotification from "../../components/Notifications/ReactNotification";
import { SET_LOGIN, TOGGLE_SPINNER, SET_ACCOUNT_INFO } from "../constants";

class ApiAction {

    actSetLogout() {
        Cookies.remove('token');
        Cookies.remove('role');
        return {
            type: SET_LOGIN,
            payload: { token: false, role: false }
        }
    }

    actSetAccountInfo(data) {
        return {
            type: SET_ACCOUNT_INFO,
            payload: data
        }
    }

    actToggleSpinner(value) {
        return {
            type: TOGGLE_SPINNER,
            payload: value
        }
    }

    processSuccessResponse(response, method) {
        if(response.status === 200 && method !== "get" && response.data.message !== "") {
            ReactNotification("success", response.data.message);
        }
    }

    processErrorResponse(response) {
        return (dispatch) => {
            switch(response.status) {
                case 400: {
                    ReactNotification("error", response.data.message);
                    return;
                }
                case 401: {
                    ReactNotification("error", response.data.message);
                    dispatch(this.actSetLogout());
                    return;
                }
                case 404: {
                    ReactNotification("error", response.data.message);
                    return;
                }
                case 500: {
                    ReactNotification("error", "Server xảy ra lỗi! Vui lòng thử lại sau!");
                    return;
                }
            }
        }
    }

    callApi(endPoint, method, headers, params, data) {
        return async (dispatch) => {
            dispatch(this.actToggleSpinner(true));
            
            try {
                const response = await callAPI(endPoint, method, headers, params, data);
                dispatch(this.actToggleSpinner(false));
                this.processSuccessResponse(response, method);
                return { ...response};
            } catch (error) {
                dispatch(this.actToggleSpinner(false));
                dispatch(this.processErrorResponse(error.response));
                return { ...error.response };
            }
        }
    }

}

export default ApiAction;
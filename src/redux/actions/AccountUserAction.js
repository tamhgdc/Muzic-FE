import ApiAction from "./ApiAction";

class AccountUserAction extends ApiAction {

    async asyncChangePassword(data) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi("account/change_password", "put", { token }, null, data));
            return response;
        }
    }


    async asyncChangeAvatar(data) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi("account/change_avatar", "put", { token, 'Content-Type': 'multipart/form-data' }, null, data));
            if(response.status === 401) {
                dispatch(this.actSetLogout());
                return false;
            }
            if(response.status === 200) {
                dispatch(this.actSetAccountInfo(response.data.data));
                return true;
            }
        }
    }

    async asyncUpdateInfo(data) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi("account", "put", { token }, null, data));
            if(response.status === 401) {
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

export default new AccountUserAction();
import ApiAction from "./ApiAction";

class AccountAdminAction extends ApiAction {

    async asyncGetAllAccount(status) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi("account", "get", { token }, { status }, null));
            return response;
        }
    }

    async asyncBlockAccount(accountId) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi(`account/${accountId}/block_account`, "put", { token }, null, null));
            return response;
        }
    }

    async asyncUnBlockAccount(accountId) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi(`account/${accountId}/unblock_account`, "put", { token }, null, null));
            return response;
        }
    }
}

export default new AccountAdminAction();
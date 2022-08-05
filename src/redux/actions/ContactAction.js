import ApiAction from "./ApiAction";

class ContactAction extends ApiAction {

    asyncSubmitContact(data) {
        return async (dispatch) => {
            const response = await dispatch(this.callApi('/contact', 'post', null, null, data));
            return response;
        }
    }

    asyncGetContact(title) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi('/contact', 'get', { token }, { title }, null));
            return response;
        }
    }

    asyncViewContact(contactId) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi(`/contact/${contactId}/is_seen`, 'put', { token }, null, null));
            return response;
        }
    }

    asyncDeleteContact(contactId) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi(`/contact/${contactId}`, 'delete', { token }, null, null));
            return response;
        }
    }
}

export default new ContactAction();
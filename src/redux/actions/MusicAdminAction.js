import ApiAction from "./ApiAction";

class MusicAdminAction extends ApiAction {

    async asyncGetCategory() {
        return async (dispatch) => {
            const response = await dispatch(this.callApi("category", "get", null, null, null));
            return response;
        }
    }

    async asyncNewCategory(category) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi("category", "post", { token }, null, { category }));
            return response;
        }
    }

    async asyncDeleteCategory(categoryId) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi(`category/${categoryId}`, "delete", { token }, null, null));
            return response;
        }
    }

    async asyncGetMusic(slugCategory = undefined, keySearch = undefined) {
        return async (dispatch) => {
            const response = await dispatch(this.callApi("music", "get", null, { slugCategory, keySearch }, null));
            return response;
        }
    }

    async asyncUploadMusic(data) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi('music', 'post', { token }, null, data));
            return response;
        }
    }

    async asyncEditMusic(musicId, data) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi(`music/${musicId}`, 'put', { token }, null, data));
            return response;
        }
    }

    async asyncChangeImage(musicId, data) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi(`music/${musicId}/change_image`, 'put', { token, 'Content-Type': 'multipart/form-data' }, null, data));
            return response;
        }
    }

    async asyncChangeSource(musicId, data) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi(`music/${musicId}/change_music`, 'put', { token, 'Content-Type': 'multipart/form-data' }, null, data));
            return response;
        }
    }

    async asyncDeleteMusic(musicId) {
        return async (dispatch, getState) => {
            const { authState: { token } } = getState();
            const response = await dispatch(this.callApi(`music/${musicId}`, 'delete', { token }, null, null));
            return response;
        }
    }
}

export default new MusicAdminAction();
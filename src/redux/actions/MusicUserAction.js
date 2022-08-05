import { SET_FORCE_MUSIC, SET_LIST_MUSIC, SET_TITLE_LIST_MUSIC, SET_LISTENED_MUSIC, SET_COMMENT } from "../constants";
import ApiAction from "./ApiAction";

class MusicUserAction extends ApiAction {

    actSetListMusic(data) {
        return {
            type: SET_LIST_MUSIC,
            payload: data
        }   
    }

    actSetForceMusic(data) {
        return {
            type: SET_FORCE_MUSIC,
            payload: data
        }
    }

    actSetTitleListMusic(data) {
        return {
            type: SET_TITLE_LIST_MUSIC,
            payload: data
        }
    }

    actSetListenedMusic(data) {
        return {
            type: SET_LISTENED_MUSIC,
            payload: data
        }   
    }

    actSetComment(data) {
        return {
            type: SET_COMMENT,
            payload: data
        }
    }

    async asyncPlayMusic() {
        return async (dispatch, getState) => {
            const { musicState: { forceMusic } } = getState();
            const response = await dispatch(this.callApi(`music/${forceMusic._id}/play_music`, "put", null, null, null));
            return response;
        }
    }

    async asyncGetCategory() {
        return async (dispatch) => {
            const response = await dispatch(this.callApi("category", "get", null, null, null));
            return response;
        }
    }

    async asyncGetMusic(slugCategory = undefined, keySearch = undefined) {
        return async (dispatch) => {
            const response = await dispatch(this.callApi("music", "get", null, { slugCategory, keySearch }, null));
            return response;
        }
    }

    async asyncGetAllComment() {
        return async (dispatch, getState) => {
            const { musicState: { forceMusic }} = getState();
            const response = await dispatch(this.callApi(`comment/${forceMusic._id}`, "get", null, null, null));
            if(response.status === 200) {
                dispatch(this.actSetComment(response.data.data.comments));
            }
        }
    }

    async asyncUploadComment(data) {
        return async (dispatch, getState) => {
            const { musicState: { forceMusic }, authState: { token } } = getState();
            const response = await dispatch(this.callApi(`comment/${forceMusic._id}`, "post", { token }, null, data));
            return response;
        }
    }

    async asyncUpdateComment(id_comment, content, index_comment) {
        return async (dispatch, getState) => {
            const { authState: { token }, musicState: { comments } } = getState();
            const response = await dispatch(this.callApi(`comment/${id_comment}`, "put", { token }, null, { content }));
            if(response.status === 200) {
                dispatch(this.actSetComment([...comments.slice(0, index_comment), response.data.data, ...comments.slice(index_comment + 1)]));
            }
        }
    }

    async asyncDeleteComment(id_comment, index_comment) {
        return async (dispatch, getState) => {
            const { authState: { token }, musicState: { comments } } = getState();
            const response = await dispatch(this.callApi(`comment/${id_comment}`, "delete", { token }, null, null));
            if(response.status === 200) {
                dispatch(this.actSetComment([...comments.slice(0, index_comment), ...comments.slice(index_comment + 1)]));
            }
        }
    }
}

export default new MusicUserAction;

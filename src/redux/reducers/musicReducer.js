import { SET_FORCE_MUSIC, SET_LIST_MUSIC, SET_TITLE_LIST_MUSIC, SET_LISTENED_MUSIC, SET_COMMENT} from '../constants';

const musicInitState = {
    titleListMusic: null,
    listMusic: [],
    forceMusic: null,
    listenedMusic: [],
    comments: []
}


const handleMusicState = (state =  musicInitState, action) => {
    switch(action.type) {
        case SET_LIST_MUSIC:
            return {
                ...state,
                listMusic: action.payload
            }
        case SET_TITLE_LIST_MUSIC: 
            return {
                ...state,
                titleListMusic: action.payload
            }
        case SET_FORCE_MUSIC:
            return {
                ...state,
                forceMusic: action.payload
            }
        case SET_LISTENED_MUSIC:
            return {
                ...state,
                listenedMusic: action.payload
            }
        case SET_COMMENT:
            return {
                ...state,
                comments: action.payload
            }
        default:
            return state;
    }
}

export default handleMusicState;
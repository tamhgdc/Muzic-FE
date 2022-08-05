import { TOGGLE_SPINNER } from "../constants";

const apiInitState = {
    loading: false
}


const handleAPIState = (state =  apiInitState, action) => {
    switch(action.type) {
        case TOGGLE_SPINNER: 
            return {
                ...state,
                loading: action.payload
            }
        default:
            return state;
    }
}

export default handleAPIState;
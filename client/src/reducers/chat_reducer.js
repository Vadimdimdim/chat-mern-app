import {
    GET_CHAT, AFTER_POST_MESSAGE
} from "../actions/types";

export default function(state={}, action){
    switch(action.type){
        case GET_CHAT:
            return {...state, chat: action.payload}
        case AFTER_POST_MESSAGE:
            return {...state, chat: state.chat.concat(action.payload)}
        default:
            return state;
    };
};
import axios from 'axios';
import {
    GET_CHAT,
    AFTER_POST_MESSAGE
} from './types';
import {CHAT_SERVER} from '../components/Config.js';

export function getChat(){
    const request = axios.get(`${CHAT_SERVER}/getChat`)
        .then(response => response.data);
    
    return {
        type: GET_CHAT,
        payload: request
    }
}

export function afterPostMessage(chatData){
    return {
        type: AFTER_POST_MESSAGE,
        payload: chatData
    }
}
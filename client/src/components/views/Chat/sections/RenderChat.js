import React from 'react'
import moment from 'moment';
import Player from 'react-player'
import { Comment, Tooltip, Avatar } from 'antd';

function RenderChat(props) {
    return (
        <div style={{ width: '100%' }}>
            <Comment
                author={props.sender.username}
                avatar={
                    <Avatar
                        src={props.sender.profilePicture} alt={props.sender.username}
                    />
                }
                content={
                    props.message.substring(0, 24) === "https://www.youtube.com/" ?
                        <Player
                            style={{ maxWidth: '400px', maxHeight: '225px' }}
                            url={props.message}
                            controls
                        />
                        :
                        props.message.substring(0, 7) === "uploads" ?
                            props.message.substring(props.message.length - 3, props.message.length) === 'mp4' ?
                                <video
                                    style={{ maxWidth: '400px' }}
                                    src={`http://localhost:5000/${props.message}`} alt="video"
                                    type="video/mp4" controls
                                />
                                :
                                <img
                                    style={{ maxWidth: '400px' }}
                                    src={`http://localhost:5000/${props.message}`}
                                    alt="img"
                                />
                            :
                            props.message.substring(0, 8) === "https://" || props.message.substring(0, 7) === "http://" ?
                            <a href={props.message}>
                                {props.message}
                            </a>
                            :
                            <p>
                                {props.message}
                            </p>
                }
                datetime={
                    <Tooltip title={moment(props.createdAt).format('YYYY-MM-DD HH:mm:ss')}>
                        <span>{moment(props.createdAt).fromNow()}</span>
                    </Tooltip>
                }
            />
        </div>
    )
}

export default RenderChat

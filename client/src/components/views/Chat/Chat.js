// import React, { Component } from 'react'
import React, { useState, useEffect, useRef } from 'react';
import io from "socket.io-client";
import { connect } from "react-redux";
import moment from "moment";
import { getChat, afterPostMessage } from "../../../actions/chat_actions";
import Dropzone from 'react-dropzone';
import RenderChat from "./sections/RenderChat";
import axios from 'axios'

import { Form, Input, Button, Row, Col, } from 'antd';
import { MessageTwoTone, EnterOutlined, UploadOutlined } from '@ant-design/icons';

function Chat(props) {
    const [ChatMessage, setChatMessage] = useState("")
    const messagesEndRef = useRef(null)
    const socket = io('http://localhost:5000');

    useEffect(() => {
        props.dispatch(getChat());

        socket.on("Output", messageFromBackEnd => {
            console.log(messageFromBackEnd)
            props.dispatch(afterPostMessage(messageFromBackEnd));
        })
    }, [])

    const renderChat = () =>
        props.chat.chat && props.chat.chat.map((chat) => (
            <RenderChat key={chat._id}  {...chat} />
        ))

    const hanleChange = (event) => {
        setChatMessage(event.target.value)
    }

    const submitChatMessage = (event) => {
        event.preventDefault();

        if (props.user.userData && !props.user.userData.isAuth) {
            return alert('Please Log in first');
        }

        if (ChatMessage !== "") {
            let chatMessage = ChatMessage
            let userId = props.user.userData._id
            let userName = props.user.userData.username;
            let userImage = props.user.userData.profilePicture;
            let nowTime = moment();
            let type = "Text"

            socket.emit("Input", {
                chatMessage,
                userId,
                userName,
                userImage,
                nowTime,
                type
            });
            setChatMessage("")
        }
    }

    const onDrop = (files) => {
        let formData = new FormData();
        const config = {
            header: { 'content-type': 'multipart/form-data' }
        }

        formData.append("file", files[0])

        axios.post('api/chat/uploadFiles', formData, config)
            .then(response => {
                if (response.data.success) {
                    let chatMessage = response.data.url
                    let userId = props.user.userData._id
                    let userName = props.user.userData.username;
                    let userImage = props.user.userData.profilePicture;
                    let nowTime = moment();
                    let type = "File"

                    socket.emit("Input", {
                        chatMessage,
                        userId,
                        userName,
                        userImage,
                        nowTime,
                        type
                    });
                }
            })
    }

    useEffect(() => {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }, [props.chat])

    return (
        <React.Fragment>
            <div>
                <p style={{ fontSize: '2rem', textAlign: 'center', marginTop: '0.5rem ' }}>PogChat</p>
            </div>

            <div style={{ maxWidth: '800px', margin: '0 auto', overflow: 'hidden' }}>
                <div style={{ height: '500px', overflowY: 'scroll' }}>
                    {props.chat &&
                        renderChat()
                    }
                    <div
                        ref={messagesEndRef}
                        style={{ float: "left", clear: "both" }}
                    />
                </div>
                <Form layout="inline" onSubmit={submitChatMessage}>
                    <Row style={{ width: '100%' }}>
                        <Col lg={18} md={18} sm={18} xs={17}>
                            <Input
                                id="message"
                                prefix={<MessageTwoTone twoToneColor="#3e91f7" />}
                                placeholder="Let's start talking"
                                type="text"
                                value={ChatMessage}
                                onChange={hanleChange}
                            />
                        </Col>

                        <Col lg={2} md={2} sm={2} xs={3}>
                            <Dropzone onDrop={onDrop}>
                                {({ getRootProps, getInputProps }) => (
                                    <section>
                                        <div {...getRootProps()} >
                                            <input {...getInputProps()} />
                                            <Button style={{ width: '100%' }}>
                                                <UploadOutlined />
                                            </Button>
                                        </div>
                                    </section>
                                )}
                            </Dropzone>
                        </Col>

                        <Col lg={4} md={4} sm={4} xs={4}>
                            <Button type="primary" style={{ width: '100%' }} onClick={submitChatMessage} htmlType="submit">
                                <EnterOutlined />
                            </Button>
                        </Col>
                    </Row>
                </Form>
            </div>
        </React.Fragment>
    )
}

const mapStateToProps = state => {
    return {
        user: state.user,
        chat: state.chat
    }
}

export default connect(mapStateToProps)(Chat);
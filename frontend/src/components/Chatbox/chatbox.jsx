import styles from "./styles.module.css";
import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import ScrollToBottom from "react-scroll-to-bottom";
import { URL } from "../../utils";
import { BsFillSendFill } from "react-icons/bs"

const updateLocalMessageList = (message) => {
  const messageList = JSON.parse(localStorage.getItem("messageList"))
  localStorage.setItem("messageList", JSON.stringify([...messageList, message]))
}

const Chatbox = (props) => {
    if (localStorage.getItem("messageList") === null) localStorage.setItem("messageList", JSON.stringify([]));

    const [socket, setSocket] = useState();
    const [currentMessage, setCurrentMessage] = useState("");
    const [messageList, setMessageList] = useState(JSON.parse(localStorage.getItem("messageList")));

    const roomId = props.interviewId + "_chat"

    useEffect(() => {
        const socket = io(`${URL}:80`)

        setSocket(socket)

        socket.emit("join", roomId)

        socket.on("receive", (data) => {
            data.user = "remote"
            setMessageList((list) => [...list, data]);
            updateLocalMessageList(data);
          });

        return () => {
          socket.removeAllListeners()
          socket.disconnect()
        }
    }, [])

    const sendMessage = async () => {
      if (currentMessage !== "") {
        const messageData = {
          room: roomId,
          user: "local",
          content: currentMessage,
          time: new Date(Date.now()).toLocaleTimeString()
        }
    
        await socket.emit("send", messageData);
        setMessageList((list) => [...list, messageData]);
        updateLocalMessageList(messageData);
        setCurrentMessage("");
      }
    }

    return (
        <div className={styles.chat_window}>
          <div className={styles.chat_body}>
            <ScrollToBottom className={styles.message_container}>
              {messageList.map((message) => {
                return (
                  <div className={`${styles.message} ${message.user === "local" ? styles.local : styles.remote}`}>
                    <div>
                      <div className={styles.message_content}>
                        <p>{message.content}</p>
                      </div>
                      <div className={styles.message_meta}>
                        <p>{message.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </ScrollToBottom>
          </div>
          <div className={styles.chat_footer}>
            <input
              type="text"
              value={currentMessage}
              placeholder=""
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
            />
            <button onClick={sendMessage}><BsFillSendFill /></button>
          </div>
        </div>
    );
}

export default Chatbox;
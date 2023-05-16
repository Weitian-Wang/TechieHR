import styles from "./styles.module.css"
import { useState, useEffect } from "react"
import { io } from "socket.io-client"
import ScrollToBottom from "react-scroll-to-bottom"
import { URL } from "../../utils"

const updateLocalMessageList = (id, message) => {
  const messageLists = JSON.parse(localStorage.getItem("messageLists"))
  if (id in messageLists) messageLists[id] = [...messageLists[id], message]
  else messageLists[id] = [message]
  localStorage.setItem("messageLists", JSON.stringify(messageLists))
}

const Chatbox = (props) => {
    if (localStorage.getItem("messageLists") === null) localStorage.setItem("messageLists", JSON.stringify({}))

    const [socket, setSocket] = useState()
    const [currentMessage, setCurrentMessage] = useState("")
    const messageLists = JSON.parse(localStorage.getItem("messageLists"))
    const [messageList, setMessageList] = useState(props.interviewId in messageLists ? messageLists[props.interviewId] : [])

    const roomId = props.interviewId + "_chat"

    useEffect(() => {
        const socket = io(`${URL}:80`)

        setSocket(socket)

        socket.emit("join", roomId)

        socket.on("receive", (data) => {
            data.user = "remote"
            setMessageList((list) => [...list, data])
            updateLocalMessageList(props.interviewId, data)
          })

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
    
        await socket.emit("send", messageData)
        setMessageList((list) => [...list, messageData])
        updateLocalMessageList(props.interviewId, messageData)
        setCurrentMessage("")
      }
    }

    return (
        <div className={styles.chat_window}>
          <div className={styles.chat_body}>
            <ScrollToBottom className={styles.message_container}>
              {messageList.map((message) => {
                return (
                  <div className={`${styles.message} ${message.user === "local" ? styles.local : styles.remote}`} key={message.time}>
                    <div className={styles.message_content}>
                      <p>{message.content}</p>
                    </div>
                    <div className={styles.message_meta}>
                      <p>{message.time}</p>
                    </div>
                  </div>
                )
              })}
            </ScrollToBottom>
          </div>
          <div className={styles.chat_footer}>
            <input
              type="text"
              value={currentMessage}
              placeholder="Send Message"
              onChange={(event) => {
                setCurrentMessage(event.target.value);
              }}
              onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    sendMessage();
                  }
              }}
            />
          </div>
        </div>
    );
}

export default Chatbox
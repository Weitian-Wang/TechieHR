import styles from './styles.module.css'
import Codepad from '../Codepad/codepad'
import Video from "../Video/video"
import Chatbox from "../Chatbox/chatbox"
import { useEffect, useState } from "react"
import { io } from "socket.io-client"
import { URL } from "../../utils";

const Interview_Main = (props) => {
    if (localStorage.getItem("code") === null) localStorage.setItem("code", JSON.stringify("class Solution():"))

    const [socket, setSocket] = useState()
    const [currentCode, setCurrentCode] = useState(JSON.parse(localStorage.getItem("code")))

    const roomId = props.interviewId

    useEffect(() => {
        const socket = io(`${URL}:80`)

        setSocket(socket)

        socket.emit("join", roomId)

        socket.on("receive", (data) => {
            setCurrentCode(data.code)
            localStorage.setItem("code", JSON.stringify(data.code))
        })

        return () => {
          socket.removeAllListeners()
          socket.disconnect()
        }
    }, [])

    const sendCode = async (code) => {
        const data = {
            room: roomId,
            code: code
        }
        await socket.emit("send", data)
        setCurrentCode(code)
        localStorage.setItem("code", JSON.stringify(code))
    }

    return (
        <div className={styles.interview_interface}>
            <div className={styles.coding_interface}>
                <Codepad
                    className={styles.code_pad}
                    needHighlight={true}
                    code={currentCode}
                    setCode={sendCode}
                ></Codepad>
            </div>
            <div className={styles.conferencing_interface}>
                <div className={styles.video_interface}>
                    <Video interviewId={props.interviewId} show_dashboard_detail={props.show_dashboard_detail}></Video>
                </div>
                <div className={styles.chat_interface}>
                    <Chatbox interviewId={props.interviewId}></Chatbox>
                </div>
            </div>
        </div>
    )
}

export default Interview_Main;
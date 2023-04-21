import styles from './styles.module.css' 
import Markdown from '../Markdown/markdown'
import Codepad from '../Codepad/codepad'
import Video from "../Video/video"
import Chatbox from "../Chatbox/chatbox"
import { useEffect, useRef, useState } from "react";

const Interview_Main = (props) => {
    const [solution_code, set_solution_code] = useState("class Solution():")

    return (
        <div className={styles.interview_interface}>
            <div className={styles.coding_interface}>
                <Codepad
                    className={styles.code_pad}
                    needHighlight={true}
                    code={solution_code}
                    setCode={set_solution_code}
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
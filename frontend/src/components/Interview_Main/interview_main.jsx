import styles from './styles.module.css'
import Codepad from '../Codepad/codepad'
import Video from "../Video/video"
import Chatbox from "../Chatbox/chatbox"
import Markdown from "../Markdown/markdown"
import Multiselect from 'multiselect-react-dropdown';
import { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client"
import { URL } from "../../utils";

const Interview_Main = (props) => {const [socket, setSocket] = useState()
    // how to support language change?
    // id: {description: markdown, code: code}
    const [questionDetails, setQuestionDetails] = useState({}); 
    const [questionOptions, setQuestionOptions] = useState([]);
    const [activeQuestionDescription, setActiveQuestionDescription] = useState("");
    const [activeQuestionID, setActiveQuestionID] = useState("");
    const [currentCode, setCurrentCode] = useState("")
    const multiselectRef = useRef(); 
    const roomId = props.interviewId

    useEffect(() => {
        const socket = io(`${URL}:80`)

        setSocket(socket)

        socket.emit("join", roomId)

        socket.on("receive", (data) => {
            setCurrentCode(data.code)
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
        questionDetails[activeQuestionID].code = code
        localStorage.setItem("code", JSON.stringify(code))
    }

    useEffect(() => {
        const post_request = async () => {
            try{
                var data;
                if(localStorage.getItem("userType") == "interviewer"){
                    data = await props.post('/api/interview/question/display/interviewer', {interview_id: props.interviewId});
                }
                if(localStorage.getItem("userType") == "interviewee"){
                    data = await props.post('/api/interview/question/display/interviewee', {interview_id: props.interviewId});
                }
                setQuestionDetails(Object.assign({}, ...data.questions.map((dict) => {
                    return {[dict.qid]: {description: dict.description, code: "class Solution:"}}
                })));
                setQuestionOptions(data.questions.map((dict) => {
                    return {title: dict.title, id: dict.qid}
                }));
                setActiveQuestionID(data.questions[0].qid)
                setActiveQuestionDescription(data.questions[0].description)
                setCurrentCode("class Solution:")
            }
            catch(error){
                console.log(error.message)
            }
        }
        post_request();
    }, [props.interviewId])
    
    const setQuestion = (e) => {
        setActiveQuestionID(e[0].id);
        // don't use activeQuestionID, not synchronous, use e[0].id instead
        setActiveQuestionDescription(questionDetails[e[0].id].description);
        setCurrentCode(questionDetails[e[0].id].code);
    }

    const submitCode = async() => {
        await props.post('/api/question/submit', { qid: activeQuestionID, interview_id: props.interviewId, solution: currentCode });
    }

    return (
        <div className={styles.interview_interface}>
            <div className={styles.question_interface}>
                <div className={styles.question_selector}>
                    <Multiselect
                            ref = {multiselectRef}
                            customCloseIcon={<></>}
                            singleSelect={true}
                            onSelect={setQuestion}
                            options={questionOptions} // Options to display in the dropdown
                            selectedValues={questionOptions.length!=0?[questionOptions[0]]:[]}
                            displayValue="title" // Property name to display in the dropdown options                  
                            style={
                                {
                                    multiselectContainer: 
                                    {
                                        width: "100%",
                                        borderRadius: "5px",
                                        backgroundColor: "var(--app-container)",
                                        color: "var(--main-color)",
                                        fontSize: "14px",
                                        outline: "none",
                                        border: "none",
                                    },
                                    searchBox:
                                    {
                                        margin: "0px",
                                    },
                                    chips: { // To change css chips(Selected options)
                                        borderRadius: "5px",
                                        margin: "0 2px",
                                        fontSize: "14px",
                                        padding: "0px",
                                    },
                                    optionContainer: { // To change css for option container 
                                        zIndex: "1",
                                        overflowX: "scroll",
                                        maxHeight: "20vh",
                                        border: "none",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                    },
                                    option: { // To change css for dropdown options
                                        color: "var(--main-color)",
                                        border: "none",
                                        backgroundColor: "var(--app-container)",
                                        padding: "13px 1em",
                                    },
                                }
                            }
                    />
                </div>
                <div className={styles.markdown}>
                    <Markdown content={activeQuestionDescription}/>
                </div>
                <div className={styles.code_button_cluster}>
                    <div className={styles.round_btn} style={{backgroundColor:"var(--status-orange)", fontSize:"1em"}} onClick={submitCode}>RUN</div>
                    <div className={styles.round_btn} style={{backgroundColor:"var(--success-green)"}} onClick={()=>{}}>&#10004;</div>
                </div>
            </div>
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
import styles from './styles.module.css'
import Codepad from '../Codepad/codepad'
import Video from "../Video/video"
import Chatbox from "../Chatbox/chatbox"
import Markdown from "../Markdown/markdown"
import Multiselect from 'multiselect-react-dropdown';
import { useEffect, useState, useRef } from "react"
import { io } from "socket.io-client"
import { URL } from "../../utils";

const Interview_Main = (props) => {
    const [socket, setSocket] = useState()
    // questionDetails
    // {id: {description: markdown, code: {lang: code}}}
    const [language, set_language] = useState("python");
    const languageOptions = [{id: "python", title:'Python 3'}, 
                             {id: "cpp", title:'C++17'},
                             {id: "javascript", title: 'JavaScript'},
                             {id: "java", title: 'Java'}];
    const codeTemplates = {"python": "class Solution:", "cpp": "class Solution {};", "javascript": "var solve = function() {};", "java": "class Solution {public int[] solve() {}"};
    const [questionDetails, setQuestionDetails] = useState({}); 
    const [questionOptions, setQuestionOptions] = useState([]);
    const [activeQuestionDescription, setActiveQuestionDescription] = useState("");
    const [activeQuestionID, setActiveQuestionID] = useState("");
    const [currentCode, setCurrentCode] = useState("")
    const multiselectRef = useRef();
    const langselectRef = useRef();
    const roomId = props.interviewId + "_code";

    const updateLocal = (interviewId, qid, lang, code) => {
        var userSolutions = JSON.parse(localStorage.getItem("userSolutions"))
        userSolutions[interviewId][qid][lang] = code
        localStorage.setItem("userSolutions", JSON.stringify(userSolutions))
    }

    useEffect(() => {
        const post_request = async () => {
            try{
                var data;
                if(localStorage.getItem("userType") === "interviewer"){
                    data = await props.post('/api/interview/question/display/interviewer', {interview_id: props.interviewId});
                }
                if(localStorage.getItem("userType") === "interviewee"){
                    data = await props.post('/api/interview/question/display/interviewee', {interview_id: props.interviewId});
                }
                var userSolutions = JSON.parse(localStorage.getItem("userSolutions"))
                if (userSolutions === null) userSolutions = {}
                if (!(props.interviewId in userSolutions)) {
                    var interviewSolutions = {}
                    for (const question of data.questions) interviewSolutions[question.qid] = codeTemplates
                    userSolutions[props.interviewId] = interviewSolutions
                } else {
                    for (const question of data.questions) {
                        if (userSolutions[props.interviewId][question.qid] == null) userSolutions[props.interviewId][question.qid] = codeTemplates
                    }
                }
                setQuestionDetails(Object.assign({}, ...data.questions.map((dict) => {
                    return {[dict.qid]: {description: dict.description, code: userSolutions[props.interviewId][dict.qid]}}
                })));
                setQuestionOptions(data.questions.map((dict) => {
                    return {title: dict.title, id: dict.qid}
                }));
                setActiveQuestionID(data.questions[0].qid)
                setActiveQuestionDescription(data.questions[0].description)
                setCurrentCode(userSolutions[props.interviewId][data.questions[0].qid][languageOptions[0].id])
                localStorage.setItem("userSolutions", JSON.stringify(userSolutions))
            }
            catch(error){
                console.log(error.message)
            }
        }
        post_request();
    }, [props.interviewId])

    useEffect(() => {
        const socket = io(`${URL}:80`)

        setSocket(socket)

        socket.emit("join", roomId)

        socket.on("receive", (data) => {
            setActiveQuestionID(data.qop[0].id)
            multiselectRef.current.state.selectedValues = data.qop
            setActiveQuestionDescription(data.details[data.qop[0].id].description)
            set_language(data.lop[0].id)
            langselectRef.current.state.selectedValues = data.lop
            setCurrentCode(data.code)
            setQuestionDetails(prev => {
                prev[data.qop[0].id].code[data.lop[0].id] = data.code
                return prev
            })

            updateLocal(props.interviewId, data.qop[0].id, data.lop[0].id, data.code)
        })

        return () => {
          socket.removeAllListeners()
          socket.disconnect()
        }
    }, [])

    const sendCode = async (code) => {
        const data = {
            room: roomId,
            code: code,
            details: questionDetails,
            qop: multiselectRef.current.getSelectedItems(),
            lop: langselectRef.current.getSelectedItems()
        }
        await socket.emit("send", data)
        setCurrentCode(code)
        setQuestionDetails(prev => {
            prev[activeQuestionID].code[language] = code
            return prev
        })
        
        updateLocal(props.interviewId, activeQuestionID, language, code)
    }
    
    const setQuestion = (e) => {
        setActiveQuestionID(e[0].id);
        setActiveQuestionDescription(questionDetails[e[0].id].description);
        setCurrentCode(questionDetails[e[0].id].code[language]);
    }

    const setLanguage = (e) => {
        set_language(e[0].id);
        setCurrentCode(questionDetails[activeQuestionID].code[e[0].id]);
    }

    const submitCode = async() => {
        await props.post('/api/question/submit', { qid: activeQuestionID, interview_id: props.interviewId, solution: currentCode, lang: language });
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
                <Multiselect
                            ref = {langselectRef}
                            customCloseIcon={<></>}
                            singleSelect={true}
                            onSelect={setLanguage}
                            options={languageOptions} // Options to display in the dropdown
                            selectedValues={[languageOptions[0]]}
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
                <div className={styles.code_container}>
                    <Codepad
                        className={styles.code_pad}
                        needHighlight={true}
                        code={currentCode}
                        setCode={sendCode}
                        lang={language}
                    ></Codepad>
                </div>
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
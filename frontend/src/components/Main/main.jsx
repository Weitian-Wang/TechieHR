import styles from "./styles.module.css";
import Dashboard from "../Dashboard/dashboard";
import Video from "../Video/video";
import Chatbox from "../Chatbox/chatbox";
import QuestionMain from "../Question_Main/question_main"
import {URL} from '../../utils'
import axios from "axios";
import { useRef, useState } from "react";

const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.localStorage.removeItem("showDash")
		window.localStorage.removeItem("showInterview")
		window.location.reload();
	};

	const [prompt_msg, set_prompt_msg] = useState("")
	const promptRef = useRef(null); 
	var promptTimeout;
	// isSuccess === true prompt success message
	// else prompt error message
	const prompt = (msg, isSuccess) => {
		set_prompt_msg(msg);
		if(isSuccess){
			clearTimeout(promptTimeout);
			promptRef.current.className = styles.success_msg;
			promptTimeout = setTimeout(() => {promptRef.current.className = styles.hide_success_msg}, 3500);
		}
		else{
			clearTimeout(promptTimeout);
			promptRef.current.className = styles.error_msg;
			promptTimeout = setTimeout(() => {promptRef.current.className = styles.hide_error_msg}, 3500);
		}
	}
	
	// encapsulated post function
	// url = "/api/register"
	// pass as prop to lower level
	// data dictionary {id:val, name:val}
	const post = async (api_url, data, msg_prompt = true) => {
		try {
			const url =`${URL}:8080` + api_url;
			const { data: res } = await axios.post(
				url, 
				data, 
				{  
					headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}` 
					}
				}
			);
			if(msg_prompt) prompt(res.message, true);
			return res.data
		} catch (error) {
			console.log(error);
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				if(msg_prompt) prompt(error.response.data.message, false);
			}
			else{
				if(msg_prompt) prompt("APP Internal Error", false);
			}
		}
	};

	// variable for button status
	const [profile_btn_active, set_profile_btn] = useState(false);
    const [question_btn_active, set_question_btn] = useState(false)
	const [interview_btn_active, set_interview_btn] = useState(false)
	const [mode_btn_active, set_mode_btn] = useState(false)

	//const [showDash, set_showDash] = useState(false)
	const [showDash, set_showDash] = useState(window.localStorage.getItem("showDash") ? window.localStorage.getItem("showDash") === "true" : true);
	const [showQuestion, set_showQuestion] = useState(false);
	const [questionId, set_questionId] = useState(null);
	//const [showInterview, set_showInterview] = useState(true);
	const [showInterview, set_showInterview] = useState(window.localStorage.getItem("showInterview") === "true");
	//const [interviewId, set_interviewId] = useState("123");
	const [interviewId, set_interviewId] = useState(null);

	const show_dashboard = () => {
		set_showDash(true);
		set_showQuestion(false);
		set_showInterview(false);
	}

	const show_question = () => {
		set_showDash(false);
		set_showQuestion(true);
		set_showInterview(false);
	}

	const show_interview = () => {
		set_showDash(false);
		window.localStorage.setItem("showDash", "false")
		set_showQuestion(false);
		set_showInterview(true);
		window.localStorage.setItem("showInterview", "true")
	}

	const show_question_detail = (e) => {
		const qid = e.target.id;
		set_questionId(qid)
		show_question();
	}

	const show_dashboard_detail = (e) => {
		show_dashboard();
	}
	
	const show_interview_detail = (e) => {
		const itvw_id = e.target.id;
		set_interviewId(itvw_id);
		show_interview();
	}

	const add_interview_btn = () => {
		if(interview_btn_active || question_btn_active){
			if(interview_btn_active){
				set_interview_btn(!interview_btn_active)
			}
			else{
				set_question_btn(!question_btn_active)
			}
		}
		set_interview_btn(!interview_btn_active)
	}

	const add_question_btn = () => {
		if(interview_btn_active || question_btn_active){
			if(interview_btn_active){
				set_interview_btn(!interview_btn_active);
			}
			else{
				set_question_btn(!question_btn_active);
			}
		}
		set_question_btn(!question_btn_active)
	}

	const switch_mode = () =>{
		document.documentElement.classList.toggle('dark');
		set_mode_btn(!mode_btn_active);
	};

	const expand_profile_options = () => {
		set_profile_btn(!profile_btn_active);
	}

	return (
		<div className={styles.main_container}>
			{/* header */}
			<nav className={styles.navbar}>
				<div className={styles.header_cluster1}>
					<h1>TechieHR</h1>
				</div>
				{/* error or success prompt */}
				<div ref={promptRef}>{prompt_msg}</div>
				<div className={styles.header_cluster2}>
					<div className={`${profile_btn_active?'settings_display':'settings_hidden'}`}>
						<button className='btn' onClick={handleLogout}>⏻</button>
						<button className={`btn ${mode_btn_active?'active':''}`} onClick={switch_mode}>🌙</button>
						<button className='btn'>⚙️</button>
					</div>
					<button className={`profile_btn ${profile_btn_active?'active':''}`} onClick={expand_profile_options}>
						{/* put user avatar in button */}
						{`${localStorage.getItem("firstName")[0].toLocaleUpperCase()}${localStorage.getItem("lastName")[0].toLocaleUpperCase()}`}
					</button>
				</div>
			</nav>
			{
			showDash?
			(<div className={styles.content_container}>
				<Dashboard 
					className={styles.interview_dash} 
					text={"Interviews"} 
					type={"interview_dash"} 
					button_status={interview_btn_active} 
					post={post}
					show_interview_detail={show_interview_detail}
				/>
				{
				localStorage.getItem("userType") === "interviewer"?
				<Dashboard 
					className={styles.problem_dash}
					text={"Questions"}
					type={"question_dash"}
					button_status={question_btn_active}
					post={post}
					show_question_detail={show_question_detail}
				/>:<></>
				}
			</div>):
			(showQuestion? 
			<div className={styles.content_container}>
					<QuestionMain 
						post={post} 
						show_dashboard_detail={show_dashboard_detail}
						qid={questionId}
					/>
			</div>
			:
			(showInterview? <div className={styles.interview_interface}>
				<div className={styles.coding_interface}>

				</div>
				<div className={styles.conferencing_interface}>
					<div className={styles.video_interface}>
						<Video interviewId={interviewId}></Video>
					</div>
					<div className={styles.chat_interface}>
						<Chatbox interviewId={interviewId}></Chatbox>
					</div>
				</div>
			</div>
			:<p>Invalid Frontend Status</p>
			)
			)
			}
		</div>
	);
};

export default Main;
import styles from "./styles.module.css";
import Dashboard from "../Dashboard/dashboard";
import Interview_Create from "../Interview_Create/interview_create"
import Question_Create from "../Question_Create/question_create"
import QuestionMain from "../Question_Main/question_main"
import Interview_Main from "../Interview_Main/interview_main"
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
				console.log(error);
				// token and authentication related error
				if(error.response.status == 401){
					prompt(error.response.data.message, false);
					setTimeout(() => {handleLogout();}, 3000);
				}
			}
			else{
				if(msg_prompt) prompt("APP Internal Error", false);
			}
		}
	};

	// variable for button status
	const [profile_btn_active, set_profile_btn] = useState(false);
	const [mode_btn_active, set_mode_btn] = useState(false)


	// const [showDash, set_showDash] = useState(window.localStorage.getItem("showDash") ? window.localStorage.getItem("showDash") === "true" : true);
	const [showDash, set_showDash] = useState(true); //set true to false to test interview room
	const [showQuestion, set_showQuestion] = useState(false);
	const [showQuestionCreate, set_showQuestionCreate] = useState(false)
	const [questionId, set_questionId] = useState(null);
	// const [showInterview, set_showInterview] = useState(window.localStorage.getItem("showInterview") === "true");
	const [showInterview, set_showInterview] = useState(false); //set false to true to test interview room
	const [showInterviewCreate, set_showInterviwCreate] = useState(false)
	const [interviewId, set_interviewId] = useState(null); //set null to a random number to test interview room

	const show_dashboard = () => {
		set_showDash(true);
		window.localStorage.setItem("showDash", "true");
		set_showQuestion(false);
		set_showQuestionCreate(false);
		set_showInterview(false);
		window.localStorage.setItem("showInterview", "false");
		set_showInterviwCreate(false);
	}

	const show_question = () => {
		set_showDash(false);
		window.localStorage.setItem("showDash", "false");
		set_showQuestion(true);
		set_showQuestionCreate(false);
		set_showInterview(false);
		window.localStorage.setItem("showInterview", "false");
		set_showInterviwCreate(false);
	}

	const show_interview = () => {
		set_showDash(false);
		window.localStorage.setItem("showDash", "false");
		set_showQuestion(false);
		set_showQuestionCreate(false);
		set_showInterview(true);
		window.localStorage.setItem("showInterview", "true");
		set_showInterviwCreate(false);
	}

	const show_interview_create = () => {
		set_showDash(false);
		window.localStorage.setItem("showDash", "false");
		set_showQuestion(false);
		set_showQuestionCreate(false);
		set_showInterview(false);
		window.localStorage.setItem("showInterview", "false");
		set_showInterviwCreate(true);
	}

	const show_question_create = () => {
		// !TODO!
		// input question name in a form
		// create new question template
		// get question id
		set_showDash(false);
		window.localStorage.setItem("showDash", "false");
		set_showQuestion(false);
		set_showQuestionCreate(true);
		set_showInterview(false);
		window.localStorage.setItem("showInterview", "false");
		set_showInterviwCreate(false);
		// show_question_detail();
	}

	const show_question_detail = (e) => {
		const qid = e.target.id;
		set_questionId(qid)
		show_question();
	}

	const show_question_id_detail = (qid) => {
		set_questionId(qid);
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

	const switch_mode = () =>{
		document.documentElement.classList.toggle('dark');
		set_mode_btn(!mode_btn_active);
	};

	const expand_profile_options = () => {
		set_profile_btn(!profile_btn_active);
	}

	const [solution_code, set_solution_code] = useState("");

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
					post={post}
					show_interview_detail={show_interview_detail}
					create={show_interview_create}
				/>
				{
				localStorage.getItem("userType") === "interviewer"?
				<Dashboard 
					className={styles.problem_dash}
					text={"Questions"}
					type={"question_dash"}
					post={post}
					show_question_detail={show_question_detail}
					create={show_question_create}
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
			(showInterview? 
			<div className={styles.content_container}>
				<Interview_Main 
					interviewId={interviewId}
					show_dashboard_detail={show_dashboard_detail}
					post={post}
				></Interview_Main>
			</div>
			:showInterviewCreate?
				<div className={styles.content_container}>
					<Interview_Create
						show_dashboard_detail={show_dashboard_detail}
						post={post}
					>
					</Interview_Create>
				</div>
			:showQuestionCreate?
			<div className={styles.content_container}>
				<Question_Create
					show_dashboard_detail = {show_dashboard_detail}
					show_question_id_detail = {show_question_id_detail}
					post = {post}
					prompt = {prompt}
				></Question_Create>
			</div>
			:<p>Invalid Frontend Status</p>
			)
			)
			}
		</div>
	);
};

export default Main;
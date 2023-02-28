import styles from "./styles.module.css";
import Dashboard from "../Dashboard/dashboard";
import Video from "../Video/video";
import QuestionMain from "../Question_Main/question_main"
/* Example of token validation*/
import { validateToken } from "../../utils";
import axios from "axios";
import { useRef, useEffect, useState } from "react";

const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	const [prompt_msg, set_prompt_msg] = useState("")
	const promptRef = useRef(null); 

	// isSuccess === true prompt success message
	// else prompt error message
	// setTimeout funky behavior, needs debounce?
	const prompt = (msg, isSuccess) => {
		set_prompt_msg(msg);
		if(isSuccess){
			promptRef.current.className = styles.success_msg;
			setTimeout(() => {promptRef.current.className = styles.hide_success_msg}, 3500);
		}
		else{
			promptRef.current.className = styles.error_msg;
			setTimeout(() => {promptRef.current.className = styles.hide_error_msg}, 3500);
		}
	}
	
	// encapsulated post function
	// url = "/api/register"
	// pass as prop to lower level
	// data dictionary {id:val, name:val}
	const post = async (api_url, data) => {
		try {
			const url = "http://localhost:8080" + api_url;
			const { data: res } = await axios.post(
				url, 
				data, 
				{  
					headers: {
					'Authorization': `Bearer ${localStorage.getItem('token')}` 
					}
				}
			);
			prompt(res.message, true);
			return res.data
		} catch (error) {
			console.log(error);
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				prompt(error.response.data.message, false);
			}
			else{
				prompt("APP Internal Error", false);
			}
		}
	};

	const [interviewStatus, setInterviewStatus] = useState({
		inInterview: false
	});

	// variable for button status
	const [profile_btn_active, set_profile_btn] = useState(false);
    const [question_btn_active, set_question_btn] = useState(false)
	const [interview_btn_active, set_interview_btn] = useState(false)
	const [mode_btn_active, set_mode_btn] = useState(false)

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
				set_interview_btn(!interview_btn_active)
			}
			else{
				set_question_btn(!question_btn_active)
			}
		}
		set_question_btn(!question_btn_active)
	}

	const switch_mode = () =>{
		document.documentElement.classList.toggle('dark');
		set_mode_btn(!mode_btn_active);
	};

	const expand_profile_options = () => {
		set_profile_btn(!profile_btn_active)
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
			{ !interviewStatus.inInterview ? 
			<div className={styles.content_container}>
				<Dashboard 
					className={styles.interview_dash} 
					text={"Interviews"} 
					type={"interview_dash"} 
					button_status={interview_btn_active} 
					onClick={add_interview_btn}
					post={post}
				/>
				<Dashboard 
					className={styles.problem_dash}
					text={"Questions"}
					type={"question_dash"}
					button_status={question_btn_active}
					onClick={add_question_btn}
					post={post}
				/>
			</div> 
			// <div className={styles.content_container}>
			// 		<QuestionMain post={post}/>
			// </div>
			:
			<div className={styles.interview_interface}>
				<div className={styles.coding_interface}>

				</div>
				<div className={styles.conferencing_interface}>
					<div className={styles.video_interface}>
						<Video></Video>
					</div>
					<div className={styles.chat_interface}>
						
					</div>
				</div>
			</div>
			}
		</div>
	);
};

export default Main;
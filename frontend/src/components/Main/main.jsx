import styles from "./styles.module.css";
import Dashboard from "../Dashboard/dashboard";
import Video from "../Video/video";
import QuestionMain from "../Question_Main/question_main"
/* Example of token validation*/
import { validateToken } from "../../utils";
import axios from "axios";
import { useRef, useReducer, useState } from "react";

const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	const dummy_interviews = [
		{
			id: 1,
			interview_name: "Initial Round",
			name: "Richard",
			email: "weitiaw1@uci.edu",
			// time format from backend to be decided
			create_time: "02/14/2023",
			scheduled_time: "02/16/2023 08:00",
			length: 60
		},
		{
			id: 2,
			interview_name: "Technical Round",
			name: "Lanny",
			email: "lannyw@uci.edu",
			// time format from backend to be decided
			create_time: "02/14/2023",
			scheduled_time: "02/16/2023 08:00",
			length: 80
		},
		{
			id: 3,
			interview_name: "Coding Round",
			name: "Richard",
			email: "weitiaw1@uci.edu",
			// time format from backend to be decided
			create_time: "02/12/2023",
			scheduled_time: "02/13/2023 08:00",
			length: 120
		},
		{
			id: 4,
			interview_name: "Behavior Interview",
			name: "Richard",
			email: "weitiaw1@uci.edu",
			// time format from backend to be decided
			create_time: "02/12/2023",
			scheduled_time: "02/26/2023 12:00",
			length: 80
		},
		{
			id: 5,
			interview_name: "HR Interview",
			name: "Richard",
			email: "weitiaw1@uci.edu",
			// time format from backend to be decided
			create_time: "02/12/2023",
			scheduled_time: "02/13/2023 15:00",
			length: 120
		},
		{
			id: 6,
			interview_name: "Final Round",
			name: "Richard",
			email: "weitiaw1@uci.edu",
			// time format from backend to be decided
			create_time: "02/15/2023",
			scheduled_time: "02/20/2023 16:00",
			length: 120
		},
		{
			id: 7,
			interview_name: "Second Round",
			name: "Richard",
			email: "weitiaw1@uci.edu",
			// time format from backend to be decided
			create_time: "02/15/2023",
			scheduled_time: "02/20/2023 21:00",
			length: 120
		}
	]

	const dummy_questions = [
		{
			id: 1,
			name: "Median of Two Sorted Array"
		},
		{
			id: 2,
			name: "Two Sum"
		},
		{
			id: 3,
			name: "Palindromic Substrings with Recursion & Two Pointers"
		},
		{
			id: 4,
			name: "Coin Change"
		},
		{
			id: 5,
			name: "Coin Change II"
		},
		{
			id: 6,
			name: "Longest Common Sequence"
		},
		{
			id: 7,
			name: "Edit Distance"
		},
	]

	const [interviewStatus, setInterviewStatus] = useState({
		inInterview: true
	});

	const [interviews, set_interviews] = useState(dummy_interviews)
	const [questions, set_questions] = useState(dummy_questions)
	
	// variable for button status
	const [profile_btn_active, set_profile_btn] = useState(false);
    const [question_btn_active, set_question_btn] = useState(false)
	const [interview_btn_active, set_interview_btn] = useState(false)
	const [mode_btn_active, set_mode_btn] = useState(false)
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
	// data dictionary {id:val, name:val}
	const post = async (api_url, data) => {
		try {
			const url = "http://localhost:8080" + api_url;
			const { data: res } = await axios.post(
				url, 
				data, 
				{  
					headers: {
					'Authorization': `${localStorage.getItem('token')}` 
					}
				}
			);
			prompt(res.message, true);
			return res.data
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				prompt(error.response.message, false);
			}
			else{
				prompt("APP Internal Error", false);
			}
		}
	};

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
						{localStorage.getItem("email")[0].toLocaleUpperCase()}
					</button>
				</div>
			</nav>
			{ !interviewStatus.inInterview ? 
			<div className={styles.dashboard_container}>
				<Dashboard 
					className={styles.interview_dash} 
					text={"Interviews"} 
					type={"interview_dash"} 
					button_status={interview_btn_active} 
					onClick={add_interview_btn}
					list={interviews}
				/>
				<Dashboard 
					className={styles.problem_dash}
					text={"Questions"} type={"question_dash"}
					button_status={question_btn_active}
					onClick={add_question_btn}
					list={display_questions}
				/>
			</div> :
			<div reserveFor="interviewInterface">
				<div reserveFor="codingComponent">

				</div>
				<Video>

				</Video>
				<div reserveFor="chatBoxComponent">

				</div>
			</div>
			}
		</div>
	);
};

export default Main;
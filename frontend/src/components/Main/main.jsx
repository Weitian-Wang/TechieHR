import styles from "./styles.module.css";
import Dashboard from "../Dashboard/dashboard";
/* Example of token validation*/
import { validateToken } from "../../utils";
import { useReducer, useState } from "react";

const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	/* Example of token validation*/
	const handleRequest = async () => { 
		await validateToken(); 
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

	const [interviews, set_interviews] = useState(dummy_interviews)
	const [questions, set_questions] = useState(dummy_questions)
	// copy of interview list and question list for searching
	const [display_interviews, set_display_interviews] = useState(interviews)
	const [display_questions, set_display_questions] = useState(questions)

	// debounce ?
	const handleChange = (e) => {
		search(e.target.value);
	}

	const search = (value) => {
		if(value.length != 0){
			set_display_interviews(interviews.filter(interview => {
				return interview.interview_name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
				||	interview.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
				||	interview.email.toLocaleLowerCase().includes(value.toLocaleLowerCase())
			}));
			set_display_questions(questions.filter(question => { 
				return question.name.toLocaleLowerCase().includes(value.toLocaleLowerCase())
			}));
		}
		else{
			set_display_interviews(interviews);
			set_display_questions(questions);
		}
	}

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
					<div className={styles.search_wrapper}>
						<input className={styles.search_input} type="text" placeholder="Search" onChange={handleChange}/>
						<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="feather feather-search" viewBox="0 0 24 24">
						<defs></defs>
						<circle cx="11" cy="11" r="8"></circle>
						<path d="M21 21l-4.35-4.35"></path>
						</svg>
					</div>
				</div>
				<div className={styles.header_cluster2}>
					<div className={`${profile_btn_active?'settings_display':'settings_hidden'}`}>
						<button className='btn' onClick={handleLogout}>⏻</button>
						<button className={`btn ${mode_btn_active?'active':''}`} onClick={switch_mode}>🌙</button>
						<button className='btn'>⚙️</button>
					</div>
					<button className={`profile_btn ${profile_btn_active?'active':''}`} onClick={expand_profile_options}>
						{/* put user avatar in button */}
						WW
					</button>
				</div>
			</nav>
			<div className={styles.dashboard_container}>
				<Dashboard 
					className={styles.interview_dash} 
					text={"Interviews"} 
					type={"interview_dash"} 
					button_status={interview_btn_active} 
					onClick={add_interview_btn}
					list={display_interviews}
				/>
				<Dashboard 
					className={styles.problem_dash}
					text={"Questions"} type={"question_dash"}
					button_status={question_btn_active}
					onClick={add_question_btn}
					list={display_questions}
				/>
			</div>
		</div>
	);
};

export default Main;
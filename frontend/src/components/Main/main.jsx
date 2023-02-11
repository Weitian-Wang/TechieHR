import styles from "./styles.module.css";
import Dashboard from "../Dashboard/dashboard";
/* Example of token validation*/
import { validateToken } from "../../utils";
import { useState } from "react";

const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
	};

	/* Example of token validation*/
	const handleRequest = async () => { 
		await validateToken(); 
	};

	const [profile_btn_active, set_profile_btn] = useState(false);

	const expand_profile_options = () => {
		set_profile_btn(!profile_btn_active)
	}
	
	return (
		<div className={styles.main_container}>
			{/* header */}
			<nav className={styles.navbar}>
				<h1>TechieHR</h1>

				{/* Example of token validation*/}
				<button onClick={handleRequest}>
					request
				</button>

				<button className={`profile_btn ${profile_btn_active?'':'btn_active'}`} onClick={expand_profile_options}>
					{/* put user avatar in button */}
					WW
				</button>
			</nav>
			<div className={`${profile_btn_active?'settings_hidden':'settings_display'}`}>
				<button className={styles.btn} onClick={handleLogout}>⏻</button>
			</div>
			<div className={styles.dashboard_container}>
				<Dashboard className={styles.interview_dash} text={"Interviews"} date={true}/>
				<Dashboard className={styles.problem_dash} text={"Questions"}/>
			</div>
		</div>
	);
};

export default Main;
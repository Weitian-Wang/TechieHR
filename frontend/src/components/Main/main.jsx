import styles from "./styles.module.css";
import Dashboard from "../Dashboard/dashboard"

/* Example of token validation*/
import { validateToken } from "../../utils";

const Main = () => {
	const handleLogout = () => {
		localStorage.removeItem("token");
		window.location.reload();
		//alert("TODO");
	};

	/* Example of token validation*/
	const handleRequest = async () => { 
		await validateToken(); 
	};

	return (
		<div className={styles.main_container}>
			{/* header */}
			<nav className={styles.navbar}>
				<h1>TechieHR</h1>

				{/* Example of token validation*/}
				<button onClick={handleRequest}>
					request
				</button>

				<button className={styles.profile_btn} onClick={handleLogout}>
					{/* put user avatar in button */}
					WW
				</button>
			</nav>
			<div className={styles.dashboard_container}>
				<Dashboard className={styles.interview_dash} text={"Interviews"} date={true}/>
				<Dashboard className={styles.problem_dash} text={"Questions"}/>
			</div>
		</div>
	);
};

export default Main;
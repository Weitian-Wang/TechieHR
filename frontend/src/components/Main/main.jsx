import styles from "./styles.module.css";
import Dashboard from "../Dashboard/dashboard"

const Main = () => {
	const handleLogout = () => {
		// localStorage.removeItem("token");
		// window.location.reload();
		alert("TODO");
	};


	return (
		<div className={styles.main_container}>
			{/* header */}
			<nav className={styles.navbar}>
				<h1>TechieHR</h1>
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
import styles from "./styles.module.css";

const Main = () => {
	const handleLogout = () => {
		// localStorage.removeItem("token");
		// window.location.reload();
		alert("TODO");
	};


	return (
		<div className={styles.main_container}>
			<nav className={styles.navbar}>
				<h1>TechieHR</h1>
				<button className={styles.white_btn} onClick={handleLogout}>
					{/* put user avatar in button */}
					Log out or something
				</button>
			</nav>
			<div className={styles.dashboard}></div>
		</div>
	);
};

export default Main;
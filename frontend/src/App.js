import { Route, Routes, Navigate } from "react-router-dom";
import Main from "./components/Main/main";
import Register from "./components/Register/register";
import Login from "./components/Login/login";

function App() {
	const token = localStorage.getItem("token");

	return (
		<Routes>
			{token && <Route path="/" exact element={<Main />} />}
			<Route path="/register" exact element={<Register />} />
			<Route path="/login" exact element={<Login />} />
			<Route path="/" element={<Navigate replace to="/login" />} />
		</Routes>
	);
}

export default App;

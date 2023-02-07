import axios from "axios";

export const validateToken = async () => {
	try {
        const token = localStorage.getItem("token");
	    const email = localStorage.getItem("email");

		const url = "http://localhost:8080/api/auth";
		const { data: res } = await axios.post(url, { email: email, token: token });

		localStorage.setItem("token", res.token);
		localStorage.setItem("email", res.email);
	} catch(error) {
        console.log(error);
		localStorage.removeItem("token");
        window.location = "/";
	}
}
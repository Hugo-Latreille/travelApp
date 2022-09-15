import Room from "@mui/icons-material/Room";
import CancelIcon from "@mui/icons-material/Cancel";
import React, { useState, useRef } from "react";
import "./login.css";
import axios from "axios";

const Login = ({ setShowLogin, myStorage, setCurrentUser }) => {
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);
	const nameRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const user = {
			username: nameRef.current.value,
			password: passwordRef.current.value,
		};
		try {
			const res = await axios.post(
				"http://localhost:8800/api/users/login",
				user
			);
			myStorage.setItem("user", res.data.username);
			setCurrentUser(res.data.username);
			setShowLogin(false);
			setError(false);
		} catch (err) {
			setError(true);
		}
	};
	return (
		<div className="loginContainer">
			<div className="logo">
				<Room />
				LamaPin
			</div>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="username" ref={nameRef} />
				<input type="password" placeholder="password" ref={passwordRef} />
				<button className="loginBtn">login</button>
				{error && <span className="error"> Something went wrong</span>}
				<CancelIcon
					className="loginCancel"
					onClick={() => setShowLogin(false)}
				/>
			</form>
		</div>
	);
};

export default Login;

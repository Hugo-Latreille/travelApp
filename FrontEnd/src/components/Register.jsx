import Room from "@mui/icons-material/Room";
import CancelIcon from "@mui/icons-material/Cancel";
import React, { useState, useRef } from "react";
import "./register.css";
import axios from "axios";

const Register = ({ setShowRegister }) => {
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(false);
	const nameRef = useRef();
	const emailRef = useRef();
	const passwordRef = useRef();

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newUser = {
			username: nameRef.current.value,
			email: emailRef.current.value,
			password: passwordRef.current.value,
		};
		try {
			await axios.post("http://localhost:8800/api/users/register", newUser);
			setError(false);
			setSuccess(true);
		} catch (err) {
			setError(true);
		}
	};
	return (
		<div className="registerContainer">
			<div className="logo">
				<Room />
				LamaPin
			</div>
			<form onSubmit={handleSubmit}>
				<input type="text" placeholder="username" ref={nameRef} />
				<input type="email" placeholder="email" ref={emailRef} />
				<input type="password" placeholder="password" ref={passwordRef} />
				<button className="registerBrn">Register</button>
				{success && (
					<span className="success"> Successfull. You can login now!</span>
				)}
				{error && <span className="error"> Something went wrong</span>}
				<CancelIcon className="cancel" onClick={() => setShowRegister(false)} />
			</form>
		</div>
	);
};

export default Register;

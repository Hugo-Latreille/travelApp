import * as React from "react";
import { useState, useEffect } from "react";
import ReactMapGL, { Marker, Popup } from "react-map-gl";
import RoomIcon from "@mui/icons-material/Room";
import StarIcon from "@mui/icons-material/Star";
import "./app.css";
import axios from "axios";
import TimeAgo from "timeago-react";
import Register from "./components/Register";
import Login from "./components/Login";

const App2 = () => {
	const myStorage = window.localStorage;
	const [currentUser, setCurrentUser] = useState(myStorage.getItem("user"));
	const [pins, setPins] = useState([]);
	const [currentPlaceId, setCurrentPlaceId] = useState(null);
	const [newPlace, setNewPlace] = useState(null);
	const [title, setTitle] = useState(null);
	const [desc, setDesc] = useState(null);
	const [rating, setRating] = useState(0);
	const [showRegister, setShowRegister] = useState(false);
	const [showLogin, setShowLogin] = useState(false);
	const [viewport, setViewport] = useState({
		latitude: 46,
		longitude: 17,
		zoom: 4,
	});

	useEffect(() => {
		const getPins = async () => {
			try {
				const allPins = await axios.get("http://localhost:8800/api/pins");
				setPins(allPins.data);
			} catch (err) {
				console.log(err);
			}
		};
		getPins();
	}, []);

	const handleMarkerClick = (id, lat, long) => {
		setCurrentPlaceId(id);
		setViewport({ ...viewport, latitude: lat, longitude: long });
	};

	const handleAddClick = (e) => {
		const [long, lat] = e.lngLat;

		setNewPlace({
			lat: lat,
			long: long,
		});
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		const newPin = {
			username: currentUser,
			title,
			desc,
			rating: rating,
			lat: newPlace.lat,
			long: newPlace.long,
		};

		try {
			const res = await axios.post("http://localhost:8800/api/pins", newPin);
			setPins([...pins, res.data]);
			setNewPlace(null);
		} catch (err) {
			console.log(err);
		}
	};

	const handleLogout = () => {
		myStorage.removeItem("user");
		setCurrentUser(null);
	};

	return (
		<ReactMapGL
			{...viewport}
			width="100vw"
			height="100vh"
			mapboxApiAccessToken={process.env.REACT_APP_MAPBOX}
			onViewportChange={(nextViewport) => setViewport(nextViewport)}
			mapStyle="mapbox://styles/hl84/ckv0t12rh24cp14o9dzvg4918"
			onDblClick={handleAddClick}
			// transitionDuration="200"
		>
			{pins.map((pin) => (
				<>
					<Marker
						key={pin._id}
						latitude={pin.lat}
						longitude={pin.long}
						offsetLeft={-viewport.zoom * 3}
						offsetTop={-viewport.zoom * 6}
					>
						<RoomIcon
							style={{
								fontSize: viewport.zoom * 6,
								cursor: "pointer",
								color: pin.username === currentUser ? "tomato" : "slateblue",
							}}
							onClick={() => handleMarkerClick(pin._id, pin.lat, pin.long)}
						/>
					</Marker>
					{pin._id === currentPlaceId && (
						<Popup
							key={pin.lat}
							latitude={pin.lat}
							longitude={pin.long}
							closeButton={true}
							anchor="left"
							onClose={() => setCurrentPlaceId(null)}
							closeOnClick="true"
						>
							<div className="card">
								<label>Place</label>
								<h4 className="place">{pin.title}</h4>
								<label>Review</label>
								<p className="description">{pin.desc}</p>
								<label>Rating</label>
								<div className="stars">
									{Array(pin.rating).fill(<StarIcon className="star" />)}
								</div>
								<label>Information</label>
								<span className="username">
									Created by <b>{pin.username}</b>
								</span>
								<span className="date">
									{" "}
									<TimeAgo datetime={pin.createdAt} locale="fr_FR" />
								</span>
							</div>
						</Popup>
					)}
				</>
			))}
			{newPlace && (
				<Popup
					latitude={newPlace.lat}
					longitude={newPlace.long}
					closeButton={true}
					closeOnClick={false}
					anchor="left"
					onClose={() => setNewPlace(null)}
				>
					<div>
						<form onSubmit={handleSubmit}>
							<label>Title</label>
							<input
								placeholder="Enter a Title"
								onChange={(e) => setTitle(e.target.value)}
							/>
							<label>Review</label>
							<textarea
								placeholder="Say something about this place"
								onChange={(e) => setDesc(e.target.value)}
							></textarea>
							<label>Rating</label>
							<select onChange={(e) => setRating(e.target.value)}>
								<option value="1">1</option>
								<option value="2">2</option>
								<option value="3">3</option>
								<option value="4">4</option>
								<option value="5">5</option>
							</select>
							<button className="submitButton" type="submit">
								Add Pin
							</button>
						</form>
					</div>
				</Popup>
			)}
			{currentUser ? (
				<button className="button logout" onClick={handleLogout}>
					Log out
				</button>
			) : (
				<div className="buttons">
					<button className="button login" onClick={() => setShowLogin(true)}>
						Login
					</button>
					<button
						className="button register"
						onClick={() => setShowRegister(true)}
					>
						Register
					</button>
				</div>
			)}
			{showRegister && <Register setShowRegister={setShowRegister} />}
			{showLogin && (
				<Login
					setShowLogin={setShowLogin}
					myStorage={myStorage}
					setCurrentUser={setCurrentUser}
				/>
			)}
		</ReactMapGL>
	);
};

export default App2;

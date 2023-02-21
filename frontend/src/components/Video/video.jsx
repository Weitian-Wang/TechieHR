import styles from "./styles.module.css"
import Peer from "simple-peer"
import { io } from "socket.io-client"
import { useEffect, useRef, useState } from "react"

const socket = io('http://localhost:80')

const Video = () => {

	const userType = localStorage.getItem("userType")

	// dummies value
	const [socketId, setSocketId] = useState("")
	const [userToCall, setUserToCall] = useState("")
	const [userCalling, setUserCalling] = useState("")

	const [ stream, setStream ] = useState()
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ sendingCall, setSendingCall ] = useState(false)
	const [ callerSignal, setCallerSignal ] = useState()
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ callEnded, setCallEnded ] = useState(true)
	const [ localAudio, setLocalAudio ] = useState(true)
	const [ localAudioTrack, setLocalAudioTrack ] = useState()
	const [ localVideoSmall, setLocalVideoSmall ] = useState(false)

	const localVideo = useRef()
	const remoteVideo = useRef()
	const connection = useRef()

	useEffect(() => {
		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setStream(stream)
			localVideo.current.srcObject = stream
		})

		socket.on("socketId", (socketId) => {
			setSocketId(socketId)
		})

		socket.on("call", (data) => {
			setReceivingCall(true)
			setUserCalling(data.from)
			setCallerSignal(data.signal)
		})

		socket.on("callEnded", () => {
			setReceivingCall(false)
			setSendingCall(false)
			setCallAccepted(false)
			setCallEnded(true)
			connection.current.destroy()
			socket.disconnect()
		})
	}, [])

	const call = () => {
		setSendingCall(true)
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("call", {
				to: userToCall,
				signalData: data,
				from: socketId
			})
		})
		peer.on("stream", (stream) => {
			remoteVideo.current.srcObject = stream
		})
		socket.on("callAccepted", (signal) => {
			setCallAccepted(true)
			setCallEnded(false)
			setSendingCall(false)
			peer.signal(signal)
		})

		connection.current = peer
	}

	const accept = () => {
		setReceivingCall(false)
		setCallAccepted(true)
		setCallEnded(false)
		const peer = new Peer({
			initiator: false,
			trickle: false,
			stream: stream
		})
		peer.on("signal", (data) => {
			socket.emit("accept", { signal: data, to: userCalling })
		})
		peer.on("stream", (stream) => {
			remoteVideo.current.srcObject = stream
		})

		peer.signal(callerSignal)
		connection.current = peer
	}

	const end = () => {
		setReceivingCall(false)
		setSendingCall(false)
		setCallAccepted(false)
		setCallEnded(true)
		connection.current.destroy()
		if (userType === "interviewer") socket.emit("end", userToCall)
		else socket.emit("end", userCalling)
		socket.disconnect()
	}

	const toggleLocalAudio = () => {
		setLocalAudio(!localAudio)
	}

    return (
        <div className={styles.video_container}>
			{stream && <div className={styles.large_video}>
				{localVideoSmall && callAccepted && !callEnded
					? <video playsInline ref={remoteVideo} autoPlay className={styles.remote_video} />
					: <video playsInline muted ref={localVideo} autoPlay className={styles.local_video} />}
				{callAccepted && !callEnded && <div className={styles.small_video} onClick={() => setLocalVideoSmall(!localVideoSmall)}>
					{localVideoSmall
						? <video playsInline muted ref={localVideo} autoPlay className={styles.local_video} />
						: <video playsInline ref={remoteVideo} autoPlay className={styles.remote_video} />}
				</div>}
			</div>}
			<div className={styles.video_buttons}>
				{userType === "interviewer" && !callAccepted && callEnded && <button onClick={call}>Join Video</button>}
				{userType === "interviewee" && receivingCall && !callAccepted && <button onClick={accept}>Answer Video</button>}
				{(receivingCall || sendingCall || !callEnded) && <button onClick={end}>End Video</button>}
				{callAccepted && !callEnded && <button onClick={toggleLocalAudio}>{localAudio ? "Close Audio" : "Open Audio"}</button>}
			</div>
			<p>{socketId}</p>
			{userType === "interviewer" && <input value={userToCall} onChange={(e) => setUserToCall(e.target.value)}></input>}
		</div>
    )
}

export default Video
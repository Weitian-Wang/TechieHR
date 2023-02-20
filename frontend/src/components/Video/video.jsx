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

	const [ localVideoSmall, setLocalVideoSmall] = useState(false)

	const localVideo = useRef()
	const callerVideo = useRef()
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
			callerVideo.current.srcObject = stream
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
			callerVideo.current.srcObject = stream
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

    return (
        <div className={styles.video_container}>
				<div className={callAccepted && localVideoSmall ? styles.small_video : styles.large_video}>
					{stream && <video playsInline muted ref={localVideo} autoPlay className={styles.local_video} />}
				</div>
				{callAccepted && !callEnded && <div className={localVideoSmall ? styles.large_video : styles.small_video}>
					<video playsInline ref={callerVideo} autoPlay />
				</div>}
				{userType === "interviewer" && !callAccepted && callEnded && <button onClick={call}>Join Video</button>}
				{userType === "interviewee" && receivingCall && !callAccepted && <button onClick={accept}>Answer Video</button>}
				{(receivingCall || sendingCall || !callEnded) && <button onClick={end}>End Video</button>}
				<p>{socketId}</p>
				{userType === "interviewer" && <input value={userToCall} onChange={(e) => setUserToCall(e.target.value)}></input>}
		</div>
    )
}

export default Video
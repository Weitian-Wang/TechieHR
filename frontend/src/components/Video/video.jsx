import styles from "./styles.module.css"
import Peer from "simple-peer"
import { io } from "socket.io-client"
import { useEffect, useRef, useState } from "react"
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa"
import { URL } from "../../utils"

const Video = () => {
	const [socket, setSocket] = useState()
	const userType = localStorage.getItem("userType")

	// dummies value
	const [socketId, setSocketId] = useState("")
	const [userToCall, setUserToCall] = useState("")
	const [userCalling, setUserCalling] = useState("")

	const [ localVideoStream, setLocalVideoStream ] = useState(null)
	const [ receivingCall, setReceivingCall ] = useState(false)
	const [ sendingCall, setSendingCall ] = useState(false)
	const [ callerSignal, setCallerSignal ] = useState(null)
	const [ callAccepted, setCallAccepted ] = useState(false)
	const [ callEnded, setCallEnded ] = useState(true)
	const [ localVideoSmall, setLocalVideoSmall ] = useState(false)

	const [ localVideoOn, setLocalVideoOn ] = useState(false)
	const [ localAudioOn, setLocalAudioOn ] = useState(false)

	const localVideo = useRef()
	const remoteVideo = useRef()
	const connection = useRef()

	useEffect(() => {
		const socket = io(`${URL}:80`)
		setSocket(socket)

		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setLocalVideoStream(stream)
			stream.getVideoTracks()[0].enabled = false
			stream.getAudioTracks()[0].enabled = false
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
		})

		return () => {
			socket.removeAllListeners()
			socket.disconnect()
		}
	}, [])

	const call = () => {
		setSendingCall(true)
		const peer = new Peer({
			initiator: true,
			trickle: false,
			stream: localVideoStream
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
			stream: localVideoStream
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
	}

	const toggleLocalVideo = () => {
		if (localVideoOn) {
			localVideoStream.getVideoTracks()[0].enabled = false
			setLocalVideoOn(false)
		} else {
			localVideoStream.getVideoTracks()[0].enabled = true
			setLocalVideoOn(true)
		}
	}

	const toggleLocalAudio = () => {
		if (localAudioOn) {
			localVideoStream.getAudioTracks()[0].enabled = false
			setLocalAudioOn(false)
		} else {
			localVideoStream.getAudioTracks()[0].enabled = true
			setLocalAudioOn(true)
		}
	}

	const localVideoHTML = <video playsInline muted ref={localVideo} autoPlay className={styles.local_video} />

	const remoteVideoHTML = <video playsInline ref={remoteVideo} autoPlay className={styles.remote_video} />

    return (
        <div className={styles.video_container}>
			<div className={callAccepted && !callEnded && localVideoSmall ? styles.small_video : styles.large_video} onClick={callAccepted && !callEnded && localVideoSmall ? () => setLocalVideoSmall(false) : ''}>{localVideoHTML}</div>
			{callAccepted && !callEnded && <div className={localVideoSmall ? styles.large_video : styles.small_video} onClick={!localVideoSmall ? () => setLocalVideoSmall(true) : ''}>{remoteVideoHTML}</div>}
			<div className={styles.video_buttons}>
				{localVideoOn ? <div className={styles.video_button} onClick={toggleLocalVideo}><FaVideo /></div> : <div className={`${styles.video_button} ${styles.video_button_red}`} onClick={toggleLocalVideo}><FaVideoSlash /></div>}
				{localAudioOn ? <div className={styles.video_button} onClick={toggleLocalAudio}><FaMicrophone /></div> : <div className={`${styles.video_button} ${styles.video_button_red}`} onClick={toggleLocalAudio}><FaMicrophoneSlash /></div>}
				{userType === "interviewer" && !callAccepted && callEnded && <button onClick={call}>Join Video</button>}
				{userType === "interviewee" && receivingCall && !callAccepted && <button onClick={accept}>Answer Video</button>}
				{(receivingCall || sendingCall || !callEnded) && <button onClick={end}>End Video</button>}
			</div>
			<p>{socketId}</p>
			{userType === "interviewer" && <input value={userToCall} onChange={(e) => setUserToCall(e.target.value)}></input>}
		</div>
    )
}

export default Video
import styles from "./styles.module.css"
import Peer from "simple-peer"
import { io } from "socket.io-client"
import { useEffect, useRef, useState } from "react"
import { FaVideo, FaVideoSlash, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa"
import { URL } from "../../utils"

const Video = (props) => {
	const [ localVideoStream, setLocalVideoStream ] = useState(null)
	const [ callEnded, setCallEnded ] = useState(true)
	const [ localVideoSmall, setLocalVideoSmall ] = useState(window.localStorage.getItem("localVideoSmall") === "true")

	const [ localVideoOn, setLocalVideoOn ] = useState(window.localStorage.getItem("localVideoOn") === "true")
	const [ localAudioOn, setLocalAudioOn ] = useState(window.localStorage.getItem("localAudioOn") === "true")

	const localVideo = useRef()
	const remoteVideo = useRef()
	const connection = useRef()

	const roomId = props.interviewId

	useEffect(() => {
		const socket = io(`${URL}:80`)

		navigator.mediaDevices.getUserMedia({ video: true, audio: true }).then((stream) => {
			setLocalVideoStream(stream)
			stream.getVideoTracks()[0].enabled = localVideoOn
			stream.getAudioTracks()[0].enabled = localAudioOn
			localVideo.current.srcObject = stream

			socket.emit("join", roomId)
		})

		socket.on("userJoined", (socketId) => {
			const peer = createPeer(true)

			peer.on("signal", (data) => {
				socket.emit("call", {
					to: socketId,
					signalData: data,
					from: socket.id
				})
			})

			peer.on("stream", (stream) => {
				remoteVideo.current.srcObject = stream
			})

			socket.on("callAccepted", (signal) => {
				peer.signal(signal)
				setCallEnded(false)
			})

			connection.current = peer
		})

		socket.on("call", (data) => {
			const peer = createPeer(false)

			peer.on("signal", (signal) => {
				socket.emit("accept", { signalData: signal, to: data.from })
			})

			peer.on("stream", (stream) => {
				remoteVideo.current.srcObject = stream
			})

			peer.signal(data.signal)
			connection.current = peer

			setCallEnded(false)
		})

		socket.on("callEnded", () => {
			setCallEnded(true)
			connection.current.destroy()
			window.location.reload()
		})

		return () => {
			socket.removeAllListeners()
			socket.disconnect()
		}
	}, [])

	const createPeer = (initiator) => {
		return new Peer({
			initiator: initiator,
			trickle: false,
			stream: localVideo.current.srcObject
		})
	}

	const toggleLocalVideoSmall = () => {
		if (localVideoSmall) {
			setLocalVideoSmall(false)
			window.localStorage.setItem("localVideoSmall", "false")
		} else {
			setLocalVideoSmall(true)
			window.localStorage.setItem("localVideoSmall", "true")
		}
	}

	const toggleLocalVideo = () => {
		if (localVideoOn) {
			localVideoStream.getVideoTracks()[0].enabled = false
			setLocalVideoOn(false)
			window.localStorage.setItem("localVideoOn", "false")
		} else {
			localVideoStream.getVideoTracks()[0].enabled = true
			setLocalVideoOn(true)
			window.localStorage.setItem("localVideoOn", "true")
		}
	}

	const toggleLocalAudio = () => {
		if (localAudioOn) {
			localVideoStream.getAudioTracks()[0].enabled = false
			setLocalAudioOn(false)
			window.localStorage.setItem("localAudioOn", "false")
		} else {
			localVideoStream.getAudioTracks()[0].enabled = true
			setLocalAudioOn(true)
			window.localStorage.setItem("localAudioOn", "true")
		}
	}

	const localVideoHTML = <video playsInline muted ref={localVideo} autoPlay className={styles.local_video} />

	const remoteVideoHTML = <video playsInline ref={remoteVideo} autoPlay className={styles.remote_video} />

    return (
        <div className={styles.video_container}>
			<div className={!callEnded && localVideoSmall ? styles.small_video : styles.large_video} onClick={!callEnded && localVideoSmall ? () => toggleLocalVideoSmall() : () => void 0}>{localVideoHTML}</div>
			{!callEnded && <div className={localVideoSmall ? styles.large_video : styles.small_video} onClick={!localVideoSmall ? () => toggleLocalVideoSmall() :  () => void 0}>{remoteVideoHTML}</div>}
			<div className={styles.video_buttons}>
				{localVideoOn ? <div className={styles.video_button} onClick={toggleLocalVideo}><FaVideo /></div> : <div className={`${styles.video_button} ${styles.video_button_red}`} onClick={toggleLocalVideo}><FaVideoSlash /></div>}
				{localAudioOn ? <div className={styles.video_button} onClick={toggleLocalAudio}><FaMicrophone /></div> : <div className={`${styles.video_button} ${styles.video_button_red}`} onClick={toggleLocalAudio}><FaMicrophoneSlash /></div>}
			</div>
		</div>
    )
}

export default Video
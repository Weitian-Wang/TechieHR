import styles from "./styles.module.css"
import DateTimePicker from 'react-datetime-picker';
import { useState, useRef, useEffect } from "react";
import Multiselect from 'multiselect-react-dropdown';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';


const Interview_Create = (props) => {
    const [interview_name, set_interview_name] = useState("");
    const [interviewee_email, set_interviewee_email] = useState("");
    const [schedule, set_schedule] = useState(new Date());
    const [duration, set_duration] = useState("");
    const [question_options, set_question_options] = useState([]);
    const [pre_selected, set_pre_selected] = useState([]);
    const multiselectRef = useRef(); 

    useEffect(() => {
        const post_request = async () => {
            try{
                var data = await props.post('/api/question/list', {}, false);
                set_question_options(data.list.map((dict) => {
                    return {title: dict.title, id: dict._id}
                }));

                if(props.interviewEdit){
                    var interview_data = await props.post('/api/interview/detail', {interview_id: props.interviewId}, false);
                    set_interview_name(interview_data.interview.interview_name);
                    set_interviewee_email(interview_data.interview.interviewee_email);
                    set_schedule(interview_data.interview.scheduled_time);
                    set_duration(interview_data.interview.duration);
                    set_pre_selected(data.list.filter((dict) => {
                        return interview_data.interview.question_list.indexOf(dict._id) != -1;
                    }).map((dict) => {
                        return {title: dict.title, id: dict._id}
                    }));
                }
            }
            catch(error){
                console.log(error.message);
            }
        }
        post_request();
    }, [])

    const handleNameChange = event => {
        set_interview_name(event.target.value);
    }

    const handleEmailChange = event => {
        set_interviewee_email(event.target.value);
    }

    const handleDurationChange = event => {
        const result = event.target.value.replace(/\D/g, '');
        set_duration(result);
    };
    
    const handleSubmit = async () =>{
        var selected = multiselectRef.current.getSelectedItems().map((item) => {return item.id});
        const request_data = {
            interview_name: interview_name,
            email: interviewee_email,
            scheduled_time: schedule,
            duration: duration,
            question_list: selected
        }
        console.log(request_data);
        var data_resp = await props.post("/api/interview/create", request_data, true);
        if(data_resp == 201){
            setTimeout(() => {props.show_dashboard_detail();}, 500);
        }
    }

    const handleDelete = async () => {
        const request_data = {
            interview_id: props.interviewId,
        }
        var data_resp = await props.post("/api/interview/delete", request_data, true);
        if(data_resp == 201){
            setTimeout(() => {props.show_dashboard_detail();}, 500);
        }
    }

    const handleUpdateSubmit = async () => {
        var selected = multiselectRef.current.getSelectedItems().map((item) => {return item.id});
        const request_data = {
            interview_id: props.interviewId,
            interview_name: interview_name,
            email: interviewee_email,
            scheduled_time: schedule,
            duration: duration,
            question_list: selected
        }
        console.log(request_data);
        var data_resp = await props.post("/api/interview/update", request_data, true);
        if(data_resp == 201){
            setTimeout(() => {props.show_dashboard_detail();}, 500);
        }
    }

	return (
			<div className={styles.content_container}>
                <div className={styles.form_container}>
                    <div className={styles.input_line}>Name
                        <input type="text" 
                            className={styles.input}
                            placeholder="Technical Interview"
                            onChange={handleNameChange}
                            value={interview_name}
                            />
                    </div>

                    <div className={styles.input_line}>Candidate
                        <input type="text" 
                            className={styles.input} 
                            placeholder="example@email.com"
                            onChange={handleEmailChange}
                            value={interviewee_email}
                            />
                    </div>

                    <div className={styles.input_line}>Schedule
                        <DateTimePicker disableClock={true} minDate={props.interviewEdit?null:new Date()} onChange={set_schedule} value={schedule}/>
                    </div>

                    <div className={styles.input_line}>Duration
                        <input type="text" 
                            className={styles.input}
                            placeholder="Number of Minutes" 
                            onChange={handleDurationChange}
                            value={duration}/>
                    </div>

                    <div className={styles.input_line}>Questions
                        <Multiselect
                            ref={multiselectRef}
                            options={question_options} // Options to display in the dropdown
                            displayValue="title" // Property name to display in the dropdown options                  
                            selectedValues={pre_selected}
                            style={
                                {
                                    multiselectContainer: 
                                    {
                                        width: "400px",
                                        borderRadius: "10px",
                                        backgroundColor: "var(--app-container)",
                                        color: "var(--main-color)",
                                        margin: "5px 0",
                                        fontSize: "14px",
                                        outline: "none",
                                        border: "none",
                                    },
                                    chips: { // To change css chips(Selected options)
                                        borderRadius: "5px",
                                        margin: "0 2px",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                        padding: "0 1em",
                                    },
                                    optionContainer: { // To change css for option container 
                                        overflowY: "scroll",
                                        maxHeight: "20vh",
                                        border: "none",
                                        fontSize: "14px",
                                        fontWeight: "500",
                                    },
                                    option: { // To change css for dropdown options
                                        color: "var(--main-color)",
                                        border: "none",
                                        backgroundColor: "var(--app-container)",
                                    },
                                }
                            }
                        />
                    </div>

                    <div className={styles.btn_cluster}>
                        {props.interviewEdit?<div className={styles.round_btn} style={{backgroundColor:"var(--status-orange)", fontSize:"1em"}} onClick={handleDelete}>DEL</div>:<></>}
                        <div className={styles.round_btn} style={{backgroundColor:"var(--error-red)"}} onClick={props.show_dashboard_detail}>X</div>
                        <div className={styles.round_btn} style={{backgroundColor:"var(--success-green)"}} onClick={props.interviewEdit?handleUpdateSubmit:handleSubmit}>&#10004;</div>
                    </div>
                </div>
			</div>
	);
};

export default Interview_Create;
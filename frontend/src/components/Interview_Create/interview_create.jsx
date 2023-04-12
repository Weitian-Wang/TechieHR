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
    const [selected_questions, set_selected_questions] = useState([]);
    const multiselectRef = useRef(); 

    useEffect(() => {
        const post_request = async () => {
            try{
                var data;
                data = await props.post('/api/question/list', {});
                set_question_options(data.list.map((dict) => {
                    return {name: dict.title, id: dict._id}
                }));
            }
            catch(error){
                console.log(error.message);
            }
        }
        post_request();
    }, [props.type])

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
        var selected = multiselectRef.current.getSelectedItems();
        set_selected_questions(selected.map((item) => {return [item.id]}));
        const request_data = {
            interview_name: interview_name,
            email: interviewee_email,
            scheduled_time: schedule,
            duration: duration,
            question_list: selected_questions
        }
        console.log(selected_questions);
        await props.post("/api/interview/create", request_data, true);
        // setTimeout(() => {props.show_dashboard_detail();}, 3500);
    }

	return (
			<div className={styles.content_container}>
                <div className={styles.form_container}>
                    <div className={styles.input_line}>Name
                        <input type="text" 
                            className={styles.input}
                            placeholder="Technical Interview"
                            onChange={handleNameChange}
                            />
                    </div>

                    <div className={styles.input_line}>Interviewee
                        <input type="text" 
                            className={styles.input} 
                            placeholder="example@email.com"
                            onChange={handleEmailChange}
                            />
                    </div>

                    <div className={styles.input_line}>Schedule
                        <DateTimePicker onChange={set_schedule} value={schedule}/>
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
                            // onSelect={this.onSelect} // Function will trigger on select event
                            // onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options                  
                        />
                    </div>

                    <div className={styles.btn_cluster}>
                        <div className={styles.round_btn} style={{backgroundColor:"var(--error-red)"}} onClick={props.show_dashboard_detail}>X</div>
                        <div className={styles.round_btn} style={{backgroundColor:"var(--success-green)"}} onClick={handleSubmit}>&#10004;</div>
                    </div>
                </div>
			</div>
	);
};

export default Interview_Create;
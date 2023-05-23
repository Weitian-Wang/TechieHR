import styles from "./styles.module.css"
import { useState, useRef, useEffect } from "react";


const Question_Create = (props) => {
    const [question_name, set_question_name] = useState("");

    const handleNameChange = event => {
        set_question_name(event.target.value);
    }
    const handleSubmit = async () =>{
        if(question_name.length == 0){
            props.prompt("Empty Title");
            return;
        }
        var data_resp = await props.post("/api/question/create", {title: question_name}, true);
        if(data_resp.status == 201){
            setTimeout(() => {props.show_question_id_detail(data_resp.qid);}, 1500);
        }
    }

	return (
                <div className={styles.form_container}>
                    <div className={styles.input_line}>Question Title
                        <input type="text" 
                            className={styles.input}
                            placeholder="Two Sum"
                            onChange={handleNameChange}
                            />
                    </div>

                    <div className={styles.btn_cluster}>
                        <div className={styles.round_btn} style={{backgroundColor:"var(--error-red)"}} onClick={props.show_dashboard_detail}>X</div>
                        <div className={styles.round_btn} style={{backgroundColor:"var(--success-green)"}} onClick={handleSubmit}>&#10004;</div>
                    </div>
                </div>
	);
};

export default Question_Create;
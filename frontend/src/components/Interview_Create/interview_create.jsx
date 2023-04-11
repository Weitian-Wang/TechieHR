import styles from "./styles.module.css"
import Seachbar from "../Searchbar/searchbar"
import { useState, useEffect } from "react";
import Multiselect from 'multiselect-react-dropdown';



const Interview_Create = (props) => {
    const [question_options, set_question_options] = useState([]);
    var selectedValue = [];

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
    
	return (
			<div className={styles.content_container}>
                <div className={styles.form_container}>
                    <div className={styles.input_line}>Name<input type="text" className={styles.input} placeholder="Technical Interview"/></div>

                    <div className={styles.input_line}>Interviewee<input type="text" className={styles.input} placeholder="example@email.com"/></div>

                    <div className={styles.input_line}>Schedule<input type="text" className={styles.input}/></div>

                    <div className={styles.input_line}>Duration<input type="numer" className={styles.input}/></div>

                    <div className={styles.input_line}>Questions
                        <Multiselect
                            options={question_options} // Options to display in the dropdown
                            selectedValues={selectedValue} // Preselected value to persist in dropdown
                            // onSelect={this.onSelect} // Function will trigger on select event
                            // onRemove={this.onRemove} // Function will trigger on remove event
                            displayValue="name" // Property name to display in the dropdown options
                        />
                    </div>

                    <div className={styles.btn_cluster}>
                        <div className={styles.round_btn} style={{backgroundColor:"var(--error-red)"}} onClick={props.show_dashboard_detail}>X</div>
                        <div className={styles.round_btn} style={{backgroundColor:"var(--success-green)"}}>&#10004;</div>
                    </div>
                </div>
			</div>
	);
};

export default Interview_Create;
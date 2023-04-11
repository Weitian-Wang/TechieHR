import styles from "./styles.module.css"
import Seachbar from "../Searchbar/searchbar"
import { useState, useEffect } from "react";

const Interview_Create = (props) => {
    var today = new Date();

    // else list = props.post('/interview/list', {})
    // copy of interview list and question list for searching
    const [question_list, set_question_list] = useState([])
	const [display_list, set_display_list] = useState(list)
    
    useEffect(() => {
        const post_request = async () => {
            try{
                var data;
                data = await props.post('/api/question/list', {});
                set_question_list(data.list);
            }
            catch(error){
                console.log(error.message)
            }
        }
        post_request()
    }, [props.type])

    useEffect(() => {
        set_display_list(list)
    }, [list])

	const search_list = (e) => {
		const value = e.target.value;
		if(value.length != 0){
			set_display_list(list.filter(item => {
                var rst = false;
                if(item.interviewer_name){
				    rst = rst || item.interviewer_name.toLocaleLowerCase().includes(value.toLocaleLowerCase());
                }
                if(item.interviewee_name){
				    rst = rst || item.interviewee_name.toLocaleLowerCase().includes(value.toLocaleLowerCase());
                }
                if(item.interview_name){
                    rst = rst || item.interview_name.toLocaleLowerCase().includes(value.toLocaleLowerCase());
                }
                if(item.interviewee_email){
                    rst = rst || item.interviewee_email.toLocaleLowerCase().includes(value.toLocaleLowerCase());
                }
                if(item.title){
                    rst = rst || item.title.toLocaleLowerCase().includes(value.toLocaleLowerCase());
                }
                return rst;
			}));
		}
		else{
			set_display_list(list);
		}
	};

	return (
			<div className={props.className}>
                {/* header */}
                <div className={styles.dash_header}>
                    <div className={styles.left_cluster}>
                            <h2>{props.text}</h2>
                            {localStorage.getItem("userType") == "interviewer"?<button className={`add_btn ${props.button_status?'active':''}`} onClick={props.onClick}>+</button>:<></>}
                    </div>
                    <Seachbar search={search_list}/>
                </div>
                {/* list of items */}
                <div className={styles.list_frame}>
                {
                    props.type==="interview_dash"?
                    display_list.map((item) => 
                    <Interview key={item._id} list_item={item} post={props.post} show_interview_detail={props.show_interview_detail}/>):
                    display_list.map((item) =>
                    <Question key={item._id} list_item={item} post={props.post} show_question_detail={props.show_question_detail}/>)
                }
                </div>
			</div>
	);
};

export default Interview_Create;
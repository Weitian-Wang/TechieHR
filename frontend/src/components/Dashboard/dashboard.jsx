import styles from "./styles.module.css"
import Interview from '../Interview/interview'
import Question from '../Question/question'
import Seachbar from "../Searchbar/searchbar"
import { useState, useEffect } from "react";

const Dashboard = (props) => {
    // else list = props.post('/interview/list', {})
    // copy of interview list and question list for searching
    const [list, set_list] = useState([])
	const [display_list, set_display_list] = useState(list)
    
    useEffect(() => {
        const post_request = async () => {
            try{
                var data;
                if(localStorage.getItem("userType") == "interviewer"){
                    if(props.type == "question_dash"){
                        data = await props.post('/api/question/list', {}, false);
                    }
                    if(props.type == "interview_dash"){
                        data = await props.post('/api/interview/list/interviewer', {}, false);
                    }
                }
                if(localStorage.getItem("userType") == "interviewee"){
                    data = await props.post('/api/interview/list/interviewee', {}, false);
                }
                set_list(data.list);
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
                            {localStorage.getItem("userType") == "interviewer"?<button className={`add_btn`} onClick={props.create}>+</button>:<></>}
                    </div>
                    <Seachbar search={search_list}/>
                </div>
                {/* list of items */}
                <div className={styles.list_frame}>
                {
                    props.type==="interview_dash"?
                    display_list.map((item) => 
                    <Interview key={item._id} list_item={item} post={props.post} show_interview_detail={props.show_interview_detail} show_interview_edit={props.show_interview_edit}/>):
                    display_list.map((item) =>
                    <Question key={item._id} list_item={item} post={props.post} show_question_detail={props.show_question_detail}/>)
                }
                </div>
			</div>
	);
};

export default Dashboard;
import styles from "./styles.module.css"
import Interview from '../Interview/interview'
import Question from '../Question/question'
import Seachbar from "../Searchbar/searchbar"
import { useState, useEffect } from "react";

const Dashboard = (props) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const mapping = {'01':'Jan','02':'Feb','03':'Mar','04':'Apr','05':'May','06':'Jun','07':'Jul','08':'Aug','09':'Sept','10':'Oct','11':'Nov','12':'Dec'};

    // else list = props.post('/interview/list', {})
    // copy of interview list and question list for searching
    const [list, set_list] = useState([])
	const [display_list, set_display_list] = useState(list)
    
    useEffect(() => {
        const post_request = async () => {
            try{
                var data;
                if(props.type == "question_dash"){
                    data = await props.post('/api/question/list', {});
                }
                if(props.type == "interview_dash"){
                    data = await props.post('/api/interview/list/interviewer', {});
                }
                set_list(data.list)
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
                if(item.name){
				    rst = rst || item.name.toLocaleLowerCase().includes(value.toLocaleLowerCase());
                }
                if(item.interview_name){
                    rst = rst || item.interview_name.toLocaleLowerCase().includes(value.toLocaleLowerCase());
                }
                if(item.email){
                    rst = rst || item.email.toLocaleLowerCase().includes(value.toLocaleLowerCase());
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
                            <button className={`add_btn ${props.button_status?'active':''}`} onClick={props.onClick}>+</button>
                    </div>
                    <Seachbar search={search_list}/>
                </div>
                {/* list of items */}
                <div className={styles.list_frame}>
                {
                    props.type==="interview_dash"?
                    display_list.map((item) => 
                    <Interview key={item.id} props={item}/>):
                    display_list.map((item) =>
                    <Question key={item.id} props={item}/>)
                }
                </div>
			</div>
	);
};

export default Dashboard;
import styles from "./styles.module.css"
import Interview from '../Interview/interview'
import Question from '../Question/question'

const Dashboard = (props) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const mapping = {'01':'Jan','02':'Feb','03':'Mar','04':'Apr','05':'May','06':'Jun','07':'Jul','08':'Aug','09':'Sept','10':'Oct','11':'Nov','12':'Dec'}

	return (
			<div className={props.className}>
                {/* header */}
                <div className={styles.dash_header}>
                    <div className={styles.left_cluster}>
                        <div>
                            <h2>{props.text}</h2>
                            {props.type==="interview_dash"?<span>Scheduled 13</span>:<></>}
                        </div>
                    </div>
                    <div>
                    {
                    props.type==="interview_dash"?
                    // interview dash board
                    <>
                    <div className={styles.right_cluster}>
                        <h2>
                            {
                            `${mapping[mm]} ${dd} ${yyyy}`
                            }
                        </h2>
                        {/* <button className={`add_btn ${props.button_status?'active':''}`} onClick={props.onClick}>+</button> */}
                    </div>
                    <span>Upcoming Today 3</span></>:<></>
                    // <button className={`add_btn ${props.button_status?'active':''}`} onClick={props.onClick}>+</button>
                    }
                    </div>
                    <button className={`add_btn ${props.button_status?'active':''}`} onClick={props.onClick}>+</button>
                </div>
                {/* list of items */}
                <div className={styles.list_frame}>
                {
                    props.type==="interview_dash"?
                    props.list.map((item) => 
                    <Interview key={item.id} props={item}/>):
                    props.list.map((item) =>
                    <Question key={item.id} props={item}/>)
                }
                </div>
			</div>
	);
};

export default Dashboard;
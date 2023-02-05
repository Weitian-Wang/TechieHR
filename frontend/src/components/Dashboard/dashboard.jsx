import { useState } from 'react';
import styles from "./styles.module.css"
import Interview from '../Interview/interview'

const Dashboard = (props) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    const mapping = {'01':'Jan','02':'Feb','03':'Mar','04':'Apr','05':'May','06':'Jun','07':'Jul','08':'Aug','09':'Sept','10':'Oct','11':'Nov','12':'Dec'}

    const dummy_interviews = [
        {
            id: 1000,
            interviewer_id: 1,
            interviewee_id: 2
        },
        {
            id: 1001,
            interviewer_id: 11,
            interviewee_id: 12
        }
    ]
    // list of interviews, fetched from backend on loading
	const [interviews, setInterviews] = useState(dummy_interviews)

	return (
			<div className={props.className}>
                {/* header */}
                <div className={styles.dash_header}>
                    <h2>{props.text}</h2>
                    {
                    props.date?
                    <div>
                        {
                        `${mapping[mm]} ${dd} ${yyyy}`
                        }
                    </div>:<></>
                    }   
                </div>
                {/* statistics */}
                <div className={styles.stats}></div>
                {/* list of items */}
                <div>
				{interviews.map((interview) => 
                    <Interview key={interview.id} props={interview}/>
                )}
                </div>
			</div>
	);
};

export default Dashboard;
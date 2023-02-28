import styles from './styles.module.css' 

const Interview = ({props, show_interview_detail}) => {
    // TEMPERARY DATA FORMAT
    // interviewer_id: {type: String, required: true},
    // interview_name: {type: String, required: true},
    // interviewee_name: {type: String, required: true},
    // interviewee_email: {type: String, required: true},
    // scheduled_time: {type: Date, required: true},
    // duration: {type: Number, required: true}

    const color_list = ['#fee4cb', '#e9e7fd', '#dbf6fd', '#ffd3e2', '#c8f7dc', '#d5deff']

	return (
        <div className={styles.interview_box} style={{backgroundColor:color_list[props._id.charCodeAt(12) % color_list.length]}}>
            <div>
                <p className={styles.name}>{`${props.interviewer_name} & ${props.interviewee_name}`}</p>
                <p className={styles.interview_name}>{`${props.interview_name}`}</p>
                <p className={styles.create_time}>{`Created ${props.createdAt}`}</p>
            </div>
            <div>
                <p className={styles.name}>{`${props.scheduled_time}`}</p>
                <p className={styles.interview_name}>{`${props.duration} Min`}</p>
                <p className={styles.create_time}> {props.interviewee_email} </p>
            </div>
            <div className={styles.action_group}>
                <button id={props._id} className={styles.btn2} onClick={(e) => show_interview_detail(e)}>Join</button>
                <button id={props._id} className={styles.btn1}>···</button>
            </div>
        </div>
    )
}

export default Interview;
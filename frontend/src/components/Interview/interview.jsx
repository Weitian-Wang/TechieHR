import styles from './styles.module.css' 

const Interview = (props) => {
    // TEMPERARY DATA FORMAT
    // interviewer_id: {type: String, required: true},
    // interview_name: {type: String, required: true},
    // interviewee_name: {type: String, required: true},
    // interviewee_email: {type: String, required: true},
    // scheduled_time: {type: Date, required: true},
    // duration: {type: Number, required: true}

    const color_list = ['#fee4cb', '#e9e7fd', '#dbf6fd', '#ffd3e2', '#c8f7dc', '#d5deff']

	return (
        <div className={styles.interview_box} style={{backgroundColor:color_list[props.list_item._id.charCodeAt(12) % color_list.length]}}>
            <div>
                <p className={styles.name}>{`${props.list_item.interviewer_name} & ${props.list_item.interviewee_name}`}</p>
                <p className={styles.interview_name}>{`${props.list_item.interview_name}`}</p>
                <p className={styles.create_time}>{`Created ${props.list_item.createdAt}`}</p>
            </div>
            <div>
                <p className={styles.name}>{`${props.list_item.scheduled_time}`}</p>
                <p className={styles.interview_name}>{`${props.list_item.duration} Min`}</p>
                <p className={styles.create_time}> {props.list_item.interviewee_email} </p>
            </div>
            <div className={styles.action_group}>
                <button id={props.list_item._id} className={styles.btn2} onClick={(e) => props.show_interview_detail(e)}>Join</button>
                <button id={props.list_item._id} className={styles.btn1}>ยทยทยท</button>
            </div>
        </div>
    )
}

export default Interview;
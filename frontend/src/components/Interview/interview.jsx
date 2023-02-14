import styles from './styles.module.css' 

const Interview = ({props}) => {
    // TEMPERARY DATA FORMAT
    // {
    // id: 7,
    // name: "Richard",
    // email: "weitiaw1@uci.edu",
    // // time format from backend to be decided
    // create_time: "02/15/2023",
    // scheduled_time: "02/20/2023",
    // length: 120
    // }

    const color_list = ['#fee4cb', '#e9e7fd', '#dbf6fd', '#ffd3e2', '#c8f7dc', '#d5deff']

	return (
        <div className={styles.interview_box} style={{backgroundColor:color_list[props.id%color_list.length]}}>
            <div>
                <p className={styles.name}>{props.name}</p>
                <p className={styles.interview_name}>{props.interview_name}</p>
                <p className={styles.create_time}>{`Created ${props.create_time}`}</p>
            </div>
            <div>
                <p className={styles.name}>{`${props.scheduled_time}`}</p>
                <p className={styles.interview_name}>{`${props.length} Min`}</p>
                <p className={styles.create_time}> {props.email} </p>
            </div>
            <div className={styles.action_group}>
                <button className={styles.btn1}>···</button>
                <button className={styles.btn2}>Join</button>
            </div>
        </div>
    )
}

export default Interview;
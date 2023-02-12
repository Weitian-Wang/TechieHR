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
	return (
        <div className={styles.interview}>
           <h3>{props.name} {props.scheduled_time}</h3>
           <button className={styles.btn}/>
           <></>
        </div>
    )
}

export default Interview;
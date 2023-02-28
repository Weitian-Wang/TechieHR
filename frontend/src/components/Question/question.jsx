import styles from './styles.module.css' 

const Question = ({props, show_question_detail}) => {
	return (
        <div className={styles.question}>
           <div className={styles.question_name}>{props.title}</div>
           <div className={styles.action_group}>
                <button className={styles.btn} id={props._id} onClick={(e) => {show_question_detail(e)}}>✏️</button>
           </div>
        </div>
    )
}

export default Question;
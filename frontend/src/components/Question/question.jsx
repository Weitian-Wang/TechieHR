import styles from './styles.module.css' 

const Question = (props) => {
	return (
        <div className={styles.question}>
           <div className={styles.question_name}>{props.list_item.title}</div>
           <div className={styles.action_group}>
                <button className={styles.btn} id={props.list_item._id} onClick={(e) => props.show_question_detail(e)}>✏️</button>
           </div>
        </div>
    )
}

export default Question;
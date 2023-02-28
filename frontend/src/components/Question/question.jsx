import styles from './styles.module.css' 

const Question = ({props}) => {
	return (
        <div className={styles.question}>
           <div className={styles.question_name}>{props.title}</div>
           <div className={styles.action_group}>
                <button className={styles.btn}>✏️</button>
           </div>
        </div>
    )
}

export default Question;
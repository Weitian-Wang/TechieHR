import styles from './styles.module.css' 

const Question = ({props}) => {
	return (
        <div className={styles.question}>
           <h3>{props.id}</h3>
           <button className={styles.btn}/>
        </div>
    )
}

export default Question;
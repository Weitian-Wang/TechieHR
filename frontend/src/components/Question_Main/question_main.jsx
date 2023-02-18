import styles from './styles.module.css' 

const QuestionMain = ({props}) => {
    // TEMPERARY DATA FORMAT
    // {
    //     id:
    //     name:
    // }

	return (
        <div className={styles.question_container}>
            <div className={styles.description}>
                Qusetion Description
            </div>
            <div className={styles.grader_code}>
                Auto Grader
            </div>
            <div>
                <div>Test Cases</div>
                <div>Result</div>
            </div>
        </div>
    )
}

export default QuestionMain;
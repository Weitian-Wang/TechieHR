import styles from './styles.module.css' 

const Interview = ({props}) => {
	return (
        <div className={styles.interview}>
           <h3 style={{ color: "black"}}>{props.id}</h3><button/>
        </div>
    )
}

export default Interview;
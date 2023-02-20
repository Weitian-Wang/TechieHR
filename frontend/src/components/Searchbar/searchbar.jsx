import styles from './styles.module.css' 

const Seachbar = (props) => {

	return (   
        <div className={styles.search_wrapper}>
            <input className={styles.search_input} type="text" placeholder="Search" onChange={props.search}/>
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="feather feather-search" viewBox="0 0 24 24">
            <defs></defs>
            <circle cx="11" cy="11" r="8"></circle>
            <path d="M21 21l-4.35-4.35"></path>
            </svg>
		</div>
    )
}

export default Seachbar;
import styles from './styles.module.css' 
import Markdown from '../Markdown/markdown'
import { useRef, useState } from "react";

const QuestionMain = ({props}) => {
    // TEMPERARY DATA FORMAT
    // {
    //     id:
    //     name:
    // }
    const [markdown_content, set_markdown_content] = useState(`## Sliding Window Maximum
---
You are given an array of integers **nums**, there is a sliding window of size array which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position.

Return the max sliding window.

## Example
---
### Example 1:  
Input: nums = [1,3,-1,-3,5,3,6,7], k = 3  
Output: [3,3,5,5,6,7]  
Explanation: 
~~~
Window position                Max
---------------               -----
[1  3  -1] -3  5  3  6  7       3
 1 [3  -1  -3] 5  3  6  7       3
 1  3 [-1  -3  5] 3  6  7       5
 1  3  -1 [-3  5  3] 6  7       5
 1  3  -1  -3 [5  3  6] 7       6
 1  3  -1  -3  5 [3  6  7]      7
~~~
### Example 2:

Input: nums = [1], k = 1   
Output: [1]

---`)
    
    const contentAreaRef = useRef();
    
    const textarea_update_content = (e) =>{
        set_markdown_content(e.target.value);
    }
	return (
        <div className={styles.question_container}>
            <div className={styles.description}>
                <div className={styles.markdown}>
                    <Markdown content={markdown_content}/>
                </div>
                <div className={styles.action_group1}>
                    <div className={styles.btn}>📁</div>
                    <div className={styles.btn}>💾</div>
                    <div className={styles.btn}>↩️</div>
                </div>
                <div className={styles.input_holder}>
                    <textarea ref={contentAreaRef} className={styles.question_md_input} value={markdown_content} 
                        onChange={(e) => {
                            set_markdown_content(e.target.value);
                        }}
                        onKeyDown={(e) => {
                            if (e.key == 'Tab') {
                            e.preventDefault();
                            const { selectionStart, selectionEnd } = e.target;
                            const newText =
                            markdown_content.substring(0, selectionStart) +
                                '  ' + // Edit this for type tab you want
                                    // Here it's 2 spaces per tab
                                    markdown_content.substring(selectionEnd, markdown_content.length);
                            contentAreaRef.current.focus();
                            contentAreaRef.current.value = newText;
                            contentAreaRef.current.setSelectionRange(
                                selectionStart + 2,
                                selectionStart + 2
                            );
                            set_markdown_content(newText);
                            }
                        }}
                    />
                </div>
            </div>
            <div className={styles.grader_code}>
                Auto Grader
            </div>
            <div className={styles.case_and_result}>
                <div>Test Cases</div>
                <div>Result</div>
                <div className={styles.round_btn} style={{backgroundColor:"var(--error-red)"}}>X</div>
                <div className={styles.round_btn} style={{backgroundColor:"var(--success-green)"}}>&#10004;</div>
            </div>
        </div>
    )
}

export default QuestionMain;
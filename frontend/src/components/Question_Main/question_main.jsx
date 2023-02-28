import styles from './styles.module.css' 
import Markdown from '../Markdown/markdown'
import Codepad from '../Codepad/codepad'
import { useRef, useState } from "react";

const QuestionMain = ({props, show_dashboard_detail}) => {
    // TEMPERARY DATA FORMAT
    // {
    //     id:
    //     name:
    // }
    const exit_to_dashboard = () => {
        show_dashboard_detail();
    }

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
    const [grader_code, set_grader_code] = useState(`
from solution import Solution
s = Solution()
output_file_name = 'output.txt'
input_file_name = 'input.txt'
with open(input_file_name, 'r'), open(output_file_name, 'w+') as input_file, output_file:
    for line in input_file:
        output_file.write(s.operation(line)+'\n')
`)
    const [solution_code, set_solution_code] = useState(`import sys
from math import floor, ceil
class Solution:
    def operation(self, input):
        output = input
        return
`)
	return (
        <div className={styles.question_container}>
            <div className={styles.description}>
                <div className={styles.markdown}>
                    <Markdown content={markdown_content}/>
                </div>
                <div className={styles.action_group}>
                    <h3 style={{margin: '0.3em 0 0.3em 0'}}>Description</h3>
                    <div className={styles.btn}>📁</div>
                    <div className={styles.btn}>💾</div>
                    <div className={styles.btn}>↩️</div>
                </div>
                <div className={styles.input_holder}>
                    <Codepad 
                        className={styles.question_md_input}
                        needHighlight={false}
                        code={markdown_content}
                        setCode={set_markdown_content}
                    />
                </div>
            </div>
            <div className={styles.grader_code}>
                <div className={styles.action_group}>
                    <h3 style={{margin: '0.3em 0 0.3em 0'}}>Auto Grader</h3>
                    <div className={styles.btn}>📁</div>
                    <div className={styles.btn}>💾</div>
                    <div className={styles.btn}>↩️</div>
                </div>
                <div className={styles.auto_grader}>
                    <Codepad 
                        className={styles.question_md_input}
                        needHighlight={true}
                        code={grader_code}
                        setCode={set_grader_code}
                    />
                </div>
                <div className={styles.action_group}>
                    <h3 style={{margin: '0.3em 0 0.3em 0'}}>Offical Solution</h3>
                    <div className={styles.btn}>📁</div>
                    <div className={styles.btn}>💾</div>
                    <div className={styles.btn}>↩️</div>
                </div>
                <div className={styles.solution}>
                    <Codepad 
                        className={styles.question_md_input}
                        needHighlight={true}
                        code={solution_code}
                        setCode={set_solution_code}
                    />
                </div>
            </div>
            <div className={styles.case_and_result}>
                <div>Test Cases</div>
                <div>Result</div>
                <div className={styles.round_btn} style={{backgroundColor:"var(--error-red)"}} onClick={exit_to_dashboard}>X</div>
                <div className={styles.round_btn} style={{backgroundColor:"var(--success-green)"}} onClick={exit_to_dashboard}>&#10004;</div>
            </div>
        </div>
    )
}

export default QuestionMain;
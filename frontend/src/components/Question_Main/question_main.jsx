import styles from './styles.module.css' 
import Markdown from '../Markdown/markdown'
import Codepad from '../Codepad/codepad'
import { useEffect, useRef, useState } from "react";

const QuestionMain = (props) => {

    const [markdown_content, set_markdown_content] = useState("");
    const [grader_code, set_grader_code] = useState("");
    const [solution_code, set_solution_code] = useState("");
    const [input_content, set_input_content] = useState("");
    const [output_content, set_output_content] = useState("");

    useEffect(() => {
        const post_request = async () => {
            try{
                const data = await props.post('/api/question/detail', { qid: props.qid });
                set_markdown_content(data.description);
                set_grader_code(data.grader);
                set_solution_code(data.solution);
                set_input_content(data.input);
                set_output_content(data.output);
            }
            catch(error){
                console.log(error.message)
            }
        }
        post_request()
    }, [])
    
    const description_upload = useRef(null);
    const grader_upload = useRef(null);
    const solution_upload = useRef(null);
    const input_upload = useRef(null);
    const output_upload = useRef(null);

    const onUploadFile = (e) => {
        var target = e.target.id;
        var file = e.target.files[0];
        var reader = new FileReader();
        reader.onload = function(event) {
            switch(target){
                case "description_upload":  set_markdown_content(event.target.result);break;
                case "grader_upload":       set_grader_code(event.target.result);break;
                case "solution_upload":     set_solution_code(event.target.result);break;
                case "input_upload":        set_input_content(event.target.result);break;
                case "output_upload":       set_output_content(event.target.result);break;
            }
        };
        reader.readAsText(file);
        // reset target otherwise same file won't trigger new event
        e.target.value = '';
    }

    const onSaveFile = (target) => {
        const post_request = async () => {
            try{
                switch(target){
                    case "description_save":    await props.post('/api/question/description/save', { qid: props.qid, content: markdown_content });break;
                    case "grader_save":          await props.post('/api/question/grader/save', { qid: props.qid, content: grader_code });break;
                    case "solution_save":       await props.post('/api/question/solution/save', { qid: props.qid, content: solution_code });break;
                    case "input_save":          await props.post('/api/question/input/save', { qid: props.qid, content: input_content });break;
                    case "output_save":         await props.post('/api/question/output/save', { qid: props.qid, content: output_content });break;
                }
            }
            catch(error){
                console.log(error.message)
            }
        }
        post_request()
    }

    const onLoadFile = (target) => {
        const post_request = async () => {
            try{
                switch(target){
                    case "description_load":    
                        {   
                            const data = await props.post('/api/question/description/load', { qid: props.qid });
                            set_markdown_content(data.description);
                            break;
                        }
                    case "grader_load":          
                        {   
                            const data = await props.post('/api/question/grader/load', { qid: props.qid });
                            set_grader_code(data.grader);
                            break;
                        }
                    case "solution_load":       
                        {   
                            const data = await props.post('/api/question/solution/load', { qid: props.qid });
                            set_solution_code(data.solution);
                            break;
                        }
                    case "input_load":
                        {
                            const data = await props.post('/api/question/input/load', { qid: props.qid });
                            set_input_content(data.input)
                            break;
                        }
                    case "output_load":
                        {
                            const data = await props.post('/api/question/output/load', { qid: props.qid });
                            set_output_content(data.output)
                            break;
                        }
                }
            }
            catch(error){
                console.log(error.message)
            }
        }
        post_request()
    }

    // for handling div clicks
    const onButtonClick = (e) => {
        // `current` points to the mounted file input element
        const target = e.target.id;
        switch(target){
            case "description_upload":  description_upload.current.click();break;
            case "description_save":    onSaveFile(target);break;
            case "description_load":    onLoadFile(target);break;
            case "grader_upload":  grader_upload.current.click();break;
            case "grader_save":    onSaveFile(target);break;
            case "grader_load":    onLoadFile(target);break;
            case "solution_upload":  solution_upload.current.click();break;
            case "solution_save":    onSaveFile(target);break;
            case "solution_load":    onLoadFile(target);break;
            case "input_upload":  input_upload.current.click();break;
            case "input_save":    onSaveFile(target);break;
            case "input_load":    onLoadFile(target);break;
            case "output_upload":  output_upload.current.click();break;
            case "output_save":    onSaveFile(target);break;
            case "output_load":    onLoadFile(target);break;
        }
    };

    const save_all_changes = async () =>{
        await props.post('/api/question/description/save', { qid: props.qid, content: markdown_content }, false);
        await props.post('/api/question/grader/save', { qid: props.qid, content: grader_code }, false);
        await props.post('/api/question/solution/save', { qid: props.qid, content: solution_code }, false);
        await props.post('/api/question/input/save', { qid: props.qid, content: input_content }, false);
        await props.post('/api/question/output/save', { qid: props.qid, content: output_content }, false);

        props.show_dashboard_detail();
    }

    const test_run = async () => {
        await props.post('/api/question/submit', { qid: props.qid, solution: solution_code });
    }

	return (
        <div className={styles.question_container}>
            <div className={styles.description}>
                <div className={styles.markdown}>
                    <Markdown content={markdown_content}/>
                </div>
                <div className={styles.action_group}>
                    <h3 style={{margin: '0.3em 0 0.3em 0'}}>Description</h3>
                    <div className={styles.btn} id='description_upload' onClick={(e) => onButtonClick(e)}>📁</div>
                    <input type='file' id='description_upload' ref={description_upload} style={{display: 'none'}} onChange={(e) => onUploadFile(e)}/>
                    <div className={styles.btn} id='description_save'   onClick={(e) => onButtonClick(e)}>💾</div>
                    <div className={styles.btn} id='description_load'   onClick={(e) => onButtonClick(e)}>↩️</div>
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
                    <div className={styles.btn} id='grader_upload' onClick={(e) => onButtonClick(e)}>📁</div>
                    <input type='file' id='grader_upload' ref={grader_upload} style={{display: 'none'}} onChange={(e) => onUploadFile(e)}/>
                    <div className={styles.btn} id='grader_save'   onClick={(e) => onButtonClick(e)}>💾</div>
                    <div className={styles.btn} id='grader_load'   onClick={(e) => onButtonClick(e)}>↩️</div>
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
                    <h3 style={{margin: '0.3em 0 0.3em 0'}}>Official Solution</h3>
                    <div className={styles.btn} id='solution_upload' onClick={(e) => onButtonClick(e)}>📁</div>
                    <input type='file' id='solution_upload' ref={solution_upload} style={{display: 'none'}} onChange={(e) => onUploadFile(e)}/>
                    <div className={styles.btn} id='solution_save'   onClick={(e) => onButtonClick(e)}>💾</div>
                    <div className={styles.btn} id='solution_load'   onClick={(e) => onButtonClick(e)}>↩️</div>
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
                <div className={styles.action_group}>
                    <h3 style={{margin: '0.3em 0 0.3em 0'}}>Input</h3>
                    <div className={styles.btn} id='input_upload' onClick={(e) => onButtonClick(e)}>📁</div>
                    <input type='file' id='input_upload' ref={input_upload} style={{display: 'none'}} onChange={(e) => onUploadFile(e)}/>
                    <div className={styles.btn} id='input_save'   onClick={(e) => onButtonClick(e)}>💾</div>
                    <div className={styles.btn} id='input_load'   onClick={(e) => onButtonClick(e)}>↩️</div>
                </div>
                <div className={styles.test_case}>
                    <Codepad 
                        className={styles.test_case_input}
                        needHighlight={true}
                        code={input_content}
                        setCode={set_input_content}
                    />
                </div>
                <div className={styles.action_group}>
                    <h3 style={{margin: '0.3em 0 0.3em 0'}}>Output</h3>
                    <div className={styles.btn} id='output_upload' onClick={(e) => onButtonClick(e)}>📁</div>
                    <input type='file' id='output_upload' ref={output_upload} style={{display: 'none'}} onChange={(e) => onUploadFile(e)}/>
                    <div className={styles.btn} id='output_save'   onClick={(e) => onButtonClick(e)}>💾</div>
                    <div className={styles.btn} id='output_load'   onClick={(e) => onButtonClick(e)}>↩️</div>
                </div>
                <div className={styles.test_case}>
                    <Codepad 
                        className={styles.test_case_input}
                        needHighlight={true}
                        code={output_content}
                        setCode={set_output_content}
                    />
                </div>
                <div className={styles.question_edit_action}>
                    <div className={styles.round_btn} style={{backgroundColor:"var(--status-orange)", fontSize:"1em"}} onClick={test_run}>RUN</div>
                    <div className={styles.round_btn} style={{backgroundColor:"var(--error-red)"}} onClick={props.show_dashboard_detail}>X</div>
                    <div className={styles.round_btn} style={{backgroundColor:"var(--success-green)"}} onClick={save_all_changes}>&#10004;</div>
                </div>
            </div>
        </div>
    )
}

export default QuestionMain;
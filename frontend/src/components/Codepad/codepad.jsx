import styles from './styles.module.css';
import {useState, useEffect} from "react"
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
// what the puck have to import all three to use cpp highlighting
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import './highlight.css'

const Codepad = (props) => {
  const [currentCode, setCurrentCode] = useState(props.code)

  useEffect(() => {
    setCurrentCode(props.code)
  }, [props.code])

  const lang_map = {"python": languages.py, "cpp": languages.cpp};

	return (
    <Editor
      className={styles.editor}
      value={currentCode}
      onValueChange={code => {
        setCurrentCode(code)
        props.setCode(code)
      }}
      highlight={code =>
        props.needHighlight?
        highlight(code, lang_map[props.lang])
        .split("\n")
        .map((line, i) => `<span class='editor_line_number' style='position: absolute; left: 0; color: #cccccc; text-align: right; width: 2em;'>${i + 1}</span>${line}`)
        .join("\n")
        :code.split("\n")
        .map((line, i) => `<span class='editor_line_number' style='position: absolute; left: 0; color: #cccccc; text-align: right; width: 2em;'>${i + 1}</span>${line}`)
        .join("\n")
      }
      padding={5}
    />
    )
}

export default Codepad;
import styles from './styles.module.css';
import Editor from 'react-simple-code-editor';
import {useState} from 'react'
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-python';
import './highlight.css'

const Codepad = (props) => {
	return (
    <Editor
      className={styles.editor}
      value={props.code}
      onValueChange={code => props.setCode(code)}
      highlight={code =>
        props.needHighlight?
        highlight(code, languages.py)
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
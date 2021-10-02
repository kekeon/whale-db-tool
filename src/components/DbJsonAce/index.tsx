import React, { useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'

interface Props {
  data?: any
  readonly?: boolean
}
type PropsExtra = Props
const DbJsonAce: React.FC<PropsExtra> = ({ readonly, data }) => {
  const [theme, setTheme] = useState<string>('monokai')
  const editRef = useRef<any>()
  const editInputValueRef = useRef<any>()
  const editSelectValueRef = useRef<any>()
  const editorDidMount = (editor: any, monaco: any) => {
    editor.focus()
  }

  useEffect(() => {}, [])

  const handleChange = (v: any) => {
    editInputValueRef.current = v
  }

  const handleSelect = (v: any, e: any) => {
    e?.stopPropagation()
    editSelectValueRef.current = v?.session?.getTextRange?.()
  }

  return (
    <AceEditor
      style={{
        width: '100%',
        height: '100%',
        overflow: 'auto',
      }}
      ref={editRef}
      placeholder="Placeholder json"
      mode="json"
      theme={theme}
      name="DB_JSON_ACE"
      value={data}
      readOnly={readonly}
      editorProps={{ $blockScrolling: false }}
      onChange={handleChange}
      onSelectionChange={handleSelect}
      setOptions={{
        enableBasicAutocompletion: true,
        enableLiveAutocompletion: true,
        enableSnippets: true,
        showLineNumbers: true,
        tabSize: 2,
      }}
    />
  )
}
export default DbJsonAce

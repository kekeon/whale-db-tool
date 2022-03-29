import { isJsonStr, JSONFormat } from '@/utils/utils'
import React, { useEffect, useImperativeHandle, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/ext-language_tools'
interface DbJsonViewProps {
  value?: any
  readonly?: boolean
}

interface DbJsonViewRefProps {
  getValue: () => string
}

const DbJsonView = React.forwardRef<DbJsonViewRefProps, DbJsonViewProps>(({ readonly, value }, ref) => {

  const getValue = () => {
    return editRef.current?.editor.getValue() || ''
  }

  useImperativeHandle(ref, () => ({
    getValue,
  }))


  const [theme, setTheme] = useState<string>('github')
  const editRef = useRef<AceEditor>(null)
  const [aceValue, setAceValue] = useState<string>(value)

  useEffect(() => {
    if (isJsonStr(value)) {
      const json = JSONFormat(value)
      // const json = JSON.stringify(value, null, '\t')
      setAceValue(json)
    } else {
      setAceValue(value)
    }
  }, [value])

  const handleChange = () => {
    
  }
  return (
    <AceEditor
          style={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
          }}
          value={aceValue}
          ref={editRef}
          placeholder="Placeholder JSON"
          mode="json"
          theme={theme}
          name="DB_STRING_ACE"
          editorProps={{ $blockScrolling: false }}
          onChange={handleChange}
          readOnly={readonly}
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
  )
})
export default DbJsonView

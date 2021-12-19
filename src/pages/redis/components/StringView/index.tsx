import React, { useEffect, useRef, useState } from 'react'
import style from './index.module.less'
import AceEditor from 'react-ace'
import { Select } from 'antd'
import { isJsonStr, JSONFormat } from '@/utils/utils'

const Option = Select.Option

interface StringViewProps {
  value: string
}
const StringView: React.FC<StringViewProps> = ({ value }) => {
  const [theme, setTheme] = useState<string>('github')
  const [valueType, setValueType] = useState<string>('json')
  const [aceValue, setAceValue] = useState<string>(value)
  const editRef = useRef<AceEditor>(null)
  const editInputValueRef = useRef<any>()
  const editSelectValueRef = useRef<any>()

  useEffect(() => {
    if (isJsonStr(value)) {
      const json = JSONFormat(value)
      console.log('json', json)
      setAceValue(json)
    } else {
      setAceValue(value)
    }
  }, [value])

  return (
    <div className={style.StringView}>
      <div className="string-view-header">
        <Select value={valueType}>
          <Option value="json">Json</Option>
          <Option value="text">Text</Option>
        </Select>
      </div>
      <div className="string-content">
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
          /*  onChange={handleChange}
          onSelectionChange={handleSelect} */
          setOptions={{
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true,
            enableSnippets: true,
            showLineNumbers: true,
            tabSize: 2,
          }}
        />
      </div>
    </div>
  )
}
export default StringView

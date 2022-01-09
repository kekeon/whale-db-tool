import React, { useCallback, useEffect, useRef, useState } from 'react'
import style from './index.module.less'
import AceEditor from 'react-ace'
import { Button, Select } from 'antd'
import { isJsonStr, JSONFormat } from '@/utils/utils'
import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import DbClipboardNode from '_cp/DbClipboardNode'
import { SaveOutlined } from '@ant-design/icons'

const Option = Select.Option

interface StringViewProps {
  value: string
  onSave?: (value: string) => void
  onChange?: (value: string) => void
}
const StringView: React.FC<StringViewProps> = ({ value, onSave, onChange }) => {
  const [theme, setTheme] = useState<string>('github')
  const [valueType, setValueType] = useState<string>('json')
  const [aceValue, setAceValue] = useState<string>(value)
  const editRef = useRef<AceEditor>(null)
  const editInputValueRef = useRef<any>()
  const editSelectValueRef = useRef<any>()

  useEffect(() => {
    if (isJsonStr(value)) {
      const json = JSONFormat(value)
      setAceValue(json)
    } else {
      setAceValue(value)
    }
  }, [value])

  const handleChange = (v) => {
    setAceValue(v)
    onChange?.(v)
  }

  const handleSave = () => {
    onSave?.(aceValue)
  }

  return (
    <div className={style.StringView}>
      <div className="string-view-header">
        <div>
          <Select value={valueType}>
            <Option value="json">Json</Option>
            <Option value="text">Text</Option>
          </Select>
        </div>
        <div className="ml15">
          <Button type="link">
            <DbClipboardNode text={aceValue} className="ml10">
              <span className="ml5 button-text hover-zoom">复制</span>
            </DbClipboardNode>
          </Button>
        </div>
        <div className="ml5">
          <Button icon={<SaveOutlined />} type="link">
            <span className="button-text hover-zoom" onClick={handleSave}>
              保存
            </span>
          </Button>
        </div>
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
          onChange={handleChange}
          // onSelectionChange={handleSelect}
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

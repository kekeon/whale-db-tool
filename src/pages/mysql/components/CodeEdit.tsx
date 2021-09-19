import { USE_DATABASES_FUN } from '@/sql/mysql.sql'
import { Button } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import 'ace-builds/src-noconflict/mode-mysql'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import style from './styles/CodeMonaco.module.less'
import { CaretRightOutlined, StepForwardOutlined, FormatPainterOutlined } from '@ant-design/icons'
import { mysql } from '@/types'
import { isEmpty } from '@/utils/utils'
interface Props {
  onRun: (sqlList: mysql.queryItem[]) => void
  db: string
}
type PropsExtra = Props

const CodeEdit: React.FC<PropsExtra> = ({ onRun, db }) => {
  //  const [code, setCode] = useState<string>('')
  const [theme, setTheme] = useState<string>('monokai')
  const editRef = useRef<any>()
  const editInputValueRef = useRef<any>()
  const editSelectValueRef = useRef<any>()
  const monacoInstanceRef = useRef<any>()
  const editorDidMount = (editor: any, monaco: any) => {
    editor.focus()
  }

  useEffect(() => {}, [])

  const handleRun = () => {
    if (isEmpty(editInputValueRef.current)) return
    // setCode(val)
    let sqlList: mysql.queryItem[] = [
      USE_DATABASES_FUN(db || ''),
      {
        type: 'query',
        sql: editInputValueRef.current,
      },
    ]
    onRun(sqlList)
  }

  const options = {
    selectOnLineNumbers: true,
  }

  const handleChange = (v: any) => {
    editInputValueRef.current = v
  }

  const handleSelect = (v, e) => {
    console.log('handleChange v', v)
    console.log('handleChange v', e)
  }

  handleSelect

  return (
    <div className={style['monaco-wrap']}>
      <div className="monaco-tool-wrap">
        <Button size="small" type={'primary'} ghost onClick={handleRun}>
          <CaretRightOutlined />
          运行
        </Button>
        <Button size="small" className={'ml5'} type={'primary'} ghost onClick={handleRun}>
          <StepForwardOutlined />
          运行选中
        </Button>

        <Button size="small" className={'ml5'} type={'primary'} ghost onClick={handleRun}>
          <FormatPainterOutlined />
          美化
        </Button>
      </div>
      <div style={{ height: '300px' }}>
        <AceEditor
          style={{
            width: '100%',
            height: '100%',
            overflow: 'auto',
          }}
          ref={editRef}
          placeholder="Placeholder SQL"
          mode="mysql"
          theme={theme}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{ $blockScrolling: false }}
          onChange={handleChange}
          onSelectionChange={handleSelect}
          // onSelection={handleSelect}
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

export default CodeEdit

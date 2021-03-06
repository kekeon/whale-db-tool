import { USE_DATABASES_FUN } from '@/statement/mysql.sql'
import { Button } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import AceEditor from 'react-ace'
import { format } from 'sql-formatter'

import 'ace-builds/src-noconflict/mode-mysql'
import 'ace-builds/src-noconflict/theme-github'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-min-noconflict/ext-searchbox'
import 'ace-builds/src-min-noconflict/ext-language_tools'
import style from './styles/CodeMonaco.module.less'
import { CaretRightOutlined, StepForwardOutlined, FormatPainterOutlined } from '@ant-design/icons'
import { mysql } from '@/types'
import { isEmpty } from '@/utils/utils'
import { useSetRecoilState } from 'recoil'
import { mySqlQueryTypeState } from '@/store/mysql'
import { mySqlQueryType } from '@/store/mysql/types'
interface Props {
  onRun: (sqlList: mysql.queryItem[]) => void
  db: string
}
type PropsExtra = Props

const CodeEdit: React.FC<PropsExtra> = ({ onRun, db }) => {
  //  const [code, setCode] = useState<string>('')
  const setMySqlQueryTypeState = useSetRecoilState(mySqlQueryTypeState)

  const [theme, setTheme] = useState<string>('monokai')
  const editRef = useRef<AceEditor>(null)
  const editInputValueRef = useRef<any>()
  const editSelectValueRef = useRef<any>()
  const editorDidMount = (editor: any, monaco: any) => {
    editor.focus()
  }

  useEffect(() => {}, [])

  const handleRun = () => {
    if (isEmpty(editInputValueRef.current)) return
    let sqlList: mysql.queryItem[] = [
      USE_DATABASES_FUN(db || ''),
      {
        type: 'query',
        sql: editInputValueRef.current,
      },
    ]
    setMySqlQueryTypeState(mySqlQueryType.SELF)
    onRun(sqlList)
  }

  const handleChange = (v: any) => {
    editInputValueRef.current = v
  }

  const handleSelect = (v: any, e: any) => {
    e?.stopPropagation()
    editSelectValueRef.current = v?.session?.getTextRange?.()
  }

  const handleRunSelect = () => {
    let sqlList: mysql.queryItem[] = [
      USE_DATABASES_FUN(db || ''),
      {
        type: 'query',
        sql: editSelectValueRef.current,
      },
    ]
    onRun(sqlList)
  }

  const handleFormat = () => {
    const sqlStr = format(editInputValueRef.current, {
      language: 'mysql',
      indent: '  ',
      uppercase: true,
      linesBetweenQueries: 1, // Defaults to 1
    })
    editRef.current?.editor.setValue(sqlStr)
  }

  return (
    <div className={style['monaco-wrap']}>
      <div className="monaco-tool-wrap">
        <Button size="small" type="primary" ghost onClick={handleRun}>
          <CaretRightOutlined />
          ??????
        </Button>
        <Button size="small" className="ml5" type="primary" ghost onClick={handleRunSelect}>
          <StepForwardOutlined />
          ????????????
        </Button>

        <Button size="small" className="ml5" type="primary" ghost onClick={handleFormat}>
          <FormatPainterOutlined />
          ??????
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
          name="DB_MYSQL_ACE"
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
      </div>
    </div>
  )
}

export default CodeEdit

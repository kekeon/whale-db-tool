import { USE_DATABASES_FUN } from '@/sql/mysql.sql'
import { Button } from 'antd'
import React, { useEffect, useRef, useState } from 'react'
import style from './styles/CodeMonaco.module.less'
import * as monaco from 'monaco-editor'
import { mysql } from '@/types'

interface Props {
  onRun: (sqlList: mysql.queryItem[]) => void
  db: string
}
type PropsExtra = Props

const CodeMonaco: React.FC<PropsExtra> = ({ onRun, db }) => {
  const [code, setCode] = useState<string>('')
  const ref = useRef<any>()
  const monacoInstanceRef = useRef<any>()
  const editorDidMount = (editor: any, monaco: any) => {
    editor.focus()
  }

  useEffect(() => {
    console.log('CodeMonaco', ref)
    monacoInstanceRef.current = monaco.editor.create(ref.current, {
      value: '',
      language: 'sql',
      theme: 'vs-dark',
    })
    console.log('monacoInstance', monacoInstanceRef)
  }, [])

  const handleRun = () => {
    let val = monacoInstanceRef.current.getValue()
    console.log('handleRun', val, db)
    setCode(val)
    let sqlList: mysql.queryItem[] = [
      USE_DATABASES_FUN(db || ''),
      {
        type: 'query',
        sql: val,
      },
    ]
    onRun(sqlList)
  }

  const options = {
    selectOnLineNumbers: true,
  }

  return (
    <div className={style['monaco-wrap']}>
      <div className="monaco-tool-wrap">
        <Button size="small" type={'primary'} ghost onClick={handleRun}>
          运行
        </Button>
      </div>
      <div style={{ height: '300px' }} ref={ref}></div>
    </div>
  )
}

export default CodeMonaco

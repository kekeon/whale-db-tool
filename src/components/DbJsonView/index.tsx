import { JSONFormat } from '@/utils/utils'
import React, { useEffect, useRef, useState } from 'react'
import ReactJson, { ThemeKeys } from 'react-json-view'

interface Props {
  data?: any
  readonly?: boolean
}
type PropsExtra = Props
const DbJsonView: React.FC<PropsExtra> = ({ readonly, data }) => {
  const [theme, setTheme] = useState<ThemeKeys>('monokai')

  return (
    <ReactJson
      indentWidth={4}
      name={false}
      displayDataTypes={false}
      style={{ fontFamily: 'system-ui' }}
      src={JSON.parse(data)}
      theme={theme}
    />
  )
}
export default DbJsonView

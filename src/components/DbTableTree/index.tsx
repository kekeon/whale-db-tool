import React, { useEffect, useState } from 'react'
import style from './index.module.less'
import { Tooltip, Tree } from 'antd'
import { DataNode, TreeProps } from 'antd/lib/tree/index'
import { DownOutlined } from '@ant-design/icons'
import classnames from 'classnames'
import DbClipboardNode from '_cp/DbClipboardNode'

interface DbTableTreeItem {
  name: string
  list: DbTableTreeItem[]
}

interface DbTableTreeProps {
  list: DbTableTreeItem[]
  config: TreeProps
}

type DbTableTreePropsExtra = DbTableTreeProps

const DbTableTree: React.FC<DbTableTreePropsExtra> = (props) => {
  const [expandedKeys, setExpandedKeys] = useState<string[]>()
  const [searchValue, setSearchValue] = useState<string>('')
  const [listData, setListData] = useState<DbTableTreeItem[]>(props.list || [])

  useEffect(() => {
    if (Array.isArray(props.list)) {
      setListData(props.list)
    }
  }, [props.list])

  const onExpand = (expandedKeys: any[]) => {
    setExpandedKeys(expandedKeys)
  }

  const loop = (data: any, pk?: string) =>
    data.map((item: DbTableTreeItem, inx: number) => {
      const index = searchValue ? item.name.indexOf(searchValue) : -1
      const beforeStr = item.name.substr(0, index)
      const afterStr = item.name.substr(index + searchValue.length)
      const name =
        index > -1 && searchValue ? (
          <span>
            {beforeStr}
            <span className="site-tree-search-value">{searchValue}</span>
            {afterStr}
          </span>
        ) : (
          <span>{item.name}</span>
        )

      const key = pk ? `${pk}.${inx}` : `${inx}`
      if (item.list) {
        return {
          icon: (
            <DbClipboardNode
              icon={
                <span
                  className={classnames('iconfont', {
                    'icon-biaoge': pk,
                    'icon-shujuku': !pk,
                    is_Load: !pk,
                  })}
                />
              }
              isIconColor={false}
              text={item.name}
            />
          ),
          title: name,
          key: key,
          children: loop(item.list, key),
        }
      }
      return {
        icon: (
          <DbClipboardNode
            icon={
              <span
                className={classnames('iconfont', {
                  'icon-biaoge': pk,
                  'icon-shujuku': !pk,
                })}
              />
            }
            isIconColor={false}
            text={item.name}
          />
        ),
        title: name,
        key: key,
      }
    })
  const titleRender = (node: DataNode) => {
    const t = (node?.title as any).props.children
    return (
      <span key={node.key} className="render-title">
        <Tooltip
          title={
            <span>
              <DbClipboardNode text={t} className={style.tooltipIcon} />
              {node.title}
            </span>
          }
          placement="right"
        >
          {node.title}
        </Tooltip>
      </span>
    )
  }

  return (
    <div className={style['db-table-tree']}>
      <Tree
        onExpand={onExpand}
        showIcon={true}
        titleRender={titleRender}
        switcherIcon={<DownOutlined />}
        expandedKeys={expandedKeys}
        autoExpandParent={true}
        blockNode={true}
        treeData={loop(listData)}
        {...props.config}
      />
    </div>
  )
}

export default DbTableTree

import { MenuItem } from '_cp/DbDropdownMenu'

export const select_excel = 'select_excel'
export const select_json = 'select_json'
export const select_inset_sql = 'select_inset_sql'
export const select_update_sql = 'select_update_sql'

export const exportMenuList: MenuItem[] = [
  {
    title: '选中项[exlce]',
    idx: select_excel,
  },
  {
    title: '选中项[json]',
    idx: select_json,
  },
  {
    title: '选中项[insetSQL]',
    idx: select_inset_sql,
  },
  {
    title: '选中项[updateSQL]',
    idx: 'select_update_sql',
  },
]

export const copy_excel = 'copy_excel'
export const copy_json = 'copy_json'
export const copy_inset_sql = 'copy_inset_sql'
export const copy_update_sql = 'copy_update_sql'
export const copyMenuList: MenuItem[] = [
  {
    title: '选中项[table]',
    id: copy_excel,
  },
  {
    title: '选中项[json]',
    id: copy_json,
  },
  {
    title: '选中项[insetSQL]',
    id: copy_inset_sql,
  },
  {
    title: '选中项[updateSQL]',
    id: copy_update_sql,
  },
]

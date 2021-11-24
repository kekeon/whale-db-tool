import { MenuItem } from '_cp/DbDropdownMenu'

export const select_excel = 'select_excel'
export const select_json = 'select_json'
export const select_inset_sql = 'select_inset_sql'
export const select_update_sql = 'select_update_sql'

export const exportMenuList: MenuItem[] = [
  {
    title: '选中项[Xlsx]',
    idx: select_excel,
  },
  {
    title: '选中项[Json]',
    idx: select_json,
  },
  {
    title: '选中项[InsetSQL]',
    idx: select_inset_sql,
  },
  {
    title: '选中项[UpdateSQL]',
    idx: select_update_sql,
  },
]

export const copy_excel = 'copy_excel'
export const copy_json = 'copy_json'
export const copy_inset_sql = 'copy_inset_sql'
export const copy_update_sql = 'copy_update_sql'
export const copyMenuList: MenuItem[] = [
  // {
  //   title: '选中项[table]',
  //   idx: copy_excel,
  // },
  {
    title: '选中项[Json]',
    idx: copy_json,
  },
  {
    title: '选中项[InsetSQL]',
    idx: copy_inset_sql,
  },
  {
    title: '选中项[UpdateSQL]',
    idx: copy_update_sql,
  },
]

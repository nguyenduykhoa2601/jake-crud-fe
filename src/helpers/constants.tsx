import { Input } from 'antd'
import AceEditor from 'react-ace'

export const UID_SIZES = [
  { label: 'Small Data', value: 'small' },
  { label: 'Big Data', value: 'big' }
]

export const LIST_REPORT = [
  {
    value: 4,
    text: 'demographics'
  },
  {
    value: 5,
    text: 'location'
  },
  {
    value: 6,
    text: 'community'
  },
  {
    value: 7,
    text: 'communication'
  },
  {
    value: 8,
    text: 'interest'
  },
  {
    value: 9,
    text: 'reading'
  }
]

export const OPTIONS_UPLOAD = [
  {
    value: 'file',
    label: 'File'
  },
  {
    value: 'path',
    label: 'HDFS Path'
  }
]

export const APPROXIMATE_SELECT = [
  {
    label: 'Yes',
    value: true
  },
  {
    label: 'No',
    value: false
  }
]

export const TYPE_LAYOUT = ['overview', '1d', 'cate', 'occupation', 'living', 'num']

export const reorderList = (list: Array<any>, startIndex: number, endIndex: number) => {
  const result = Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

export const LIST_DATE_FORMAT = [
  { value: 'yyyy-MM-dd', label: 'yyyy-MM-dd' },
  { value: 'yyyy/MM/dd', label: 'yyyy/MM/dd' },
  { value: 'yyyy-MM', label: 'yyyy-MM' },
  { value: 'yyyy/MM', label: 'yyyy/MM' }
]

export const LIST_TYPE_DATA = [
  {
    value: 'auto',
    label: 'auto'
  },
  {
    value: 'cate',
    label: 'cate'
  },
  {
    value: 'num',
    label: 'num'
  }
]

export const VERSIONS = [
  {
    title: 'Version 2.0.0',
    summary: 'Summary: Give more actions in advanced setting and history page',
    desc: ['Rerun report.', 'Summary report submitted.', 'Compare Report.', 'AutoML Report.']
  }
]

export const CURRENT_VERSION = '0.0.1'

export const LIST_TARGET_DEFAULT = [
  'marital_status',
  'pred_gender',
  'pred_age_bin',
  'telco',
  'most_used_device_brand',
  'pred_age',
  'num_device',
  'occupation_color',
  'living_province'
]

export const RBT_SELECT = [
  'all channels',
  'visit_src_zmp3_ad',
  'visit_src_others',
  'visit_src_tabme',
  'visit_src_setting',
  'visit_src_discovery',
  'visit_src_oa',
  'visit_src_global_search',
  'visit_src_search_suggestions',
  'visit_src_zmp_store',
  'visit_src_social_footer'
]

export const TYPE_MONITORING = ['html', 'python', 'form']

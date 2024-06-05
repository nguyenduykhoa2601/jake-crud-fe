import {
  Button,
  Checkbox,
  DatePicker,
  Divider,
  Empty,
  Form,
  Input,
  InputRef,
  Modal,
  Radio,
  Select,
  Skeleton,
  Space,
  Tooltip
} from 'antd'
import styles from './ChooseParam.module.scss'
import { useAppDispatch, useAppSelector } from '../../../redux/store'
import { useForm } from 'antd/lib/form/Form'
import { QuestionCircleOutlined, SettingOutlined } from '@ant-design/icons'
import { memo, useEffect, useRef, useState } from 'react'
import { LIST_DATE_FORMAT, LIST_TARGET_DEFAULT, LIST_TYPE_DATA, UID_SIZES } from '../../../helpers/constants'
import moment from 'moment'
import { indexOfArr, mapUserFeatures } from '../../../helpers/utils'
import { doSubmitJob } from '../../../redux/actions/airflow'
import { doGetTypeReportsCommon } from '../../../redux/actions/masterData'
import { useHistory } from 'react-router-dom'
import useNotification from '../../../hooks/useNotification'
import ModalLoading from '../../../components/ModalLoading/ModalLoading'
import Note from '../../../components/Note/Note'

const ChooseParam = () => {
  const { isLoading, columns, path } = useAppSelector((state) => state.hdfs)
  const { typeReports } = useAppSelector((state) => state.masterData)
  const [isOpenModalSettings, setIsOpenModalSettings] = useState(false)
  const [form] = useForm()
  const [isSubmiting, setIsSubmiting] = useState(false)
  const [typeCompare, setTypeCompare] = useState(null)

  const [items, setItems] = useState(LIST_DATE_FORMAT)
  const [name, setName] = useState('')

  const [listKeepFeatures, setListKeepFeatures] = useState<Array<string>>([])
  const [listFeatureTypeMap, setListFeatureTypeMap] = useState<any>({})

  const inputRef = useRef<InputRef>(null)
  const divRef = useRef<any>(null)

  const dispatch = useAppDispatch()
  const history = useHistory()
  const { openNotification } = useNotification()

  useEffect(() => {
    if (typeCompare === 'Zalo_A30') {
      form.setFieldValue('nameUIDPath', 'Target')
      form.setFieldValue('nameComparePath', 'Zalo_A30')
    }

    if (typeCompare === 'UID_Path') {
      form.setFieldValue('nameUIDPath', 'Left')
      form.setFieldValue('nameComparePath', 'Right')
    }
  }, [typeCompare])

  useEffect(() => {
    if (columns && columns.length > 0) {
      const init = [...columns]
      init.shift()
      setListKeepFeatures(init)
    }
  }, [columns])

  useEffect(() => {
    dispatch(doGetTypeReportsCommon())
  }, [])

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  const addItem = (e: any) => {
    e.preventDefault()
    const newItems = [...items]
    newItems.push({
      label: name,
      value: name
    })

    form.setFieldValue('dateFormat', name)

    setItems(newItems)
    setName('')
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  const onSubmit = () => {
    setIsSubmiting(true)

    dispatch(
      doSubmitJob({
        uid_size: form.getFieldValue('uidSize'),
        year_month: form.getFieldValue('date')?.format('YYYY/MM') ?? '',
        refer_time_col: form.getFieldValue('referTimeCol') ?? '',
        date_format: form.getFieldValue('referTimeFormat') ?? '',
        target_features: form.getFieldValue('targetFeature'),
        approximate: {
          count_distinct: form.getFieldValue('countDistinct'),
          percentile: form.getFieldValue('percentile')
        },
        hdfs_path: path,
        feature_type_map: listFeatureTypeMap,
        list_keep_features: listKeepFeatures,
        report_type: form.getFieldValue('reportType'),
        uid_col_name: form.getFieldValue('uidCol') ?? columns[0],
        uid_paths: form.getFieldValue('compareConfig')
          ? form.getFieldValue('compareConfig') === 'Zalo_A30'
            ? [path, form.getFieldValue('compareConfig')]
            : [path, form.getFieldValue('inputUIDPath')]
          : [],
        names: [form.getFieldValue('nameUIDPath') ?? '', form.getFieldValue('nameComparePath') ?? ''],
        label: form.getFieldValue('label')
      })
    )
      .then((res) => {
        if (res.payload.code === 0) {
          history.push('/history')

          openNotification({
            type: 'success',
            description: 'Success',
            message: 'Your request has been submited! Please wait for a few minutes'
          })
        } else {
          openNotification({
            type: 'error',
            description: 'We are fixing, please wait for a few minutues!',
            message: 'Opps! Something went wrong!'
          })
        }

        setIsSubmiting(false)
      })
      .catch((_) => {
        openNotification({
          type: 'error',
          description: 'We are fixing, please wait for a few minutues!',
          message: 'Opps! Something went wrong!'
        })

        setIsSubmiting(false)
      })
  }

  return (
    <div className={styles.root} ref={divRef}>
      {isSubmiting && <ModalLoading />}

      <Skeleton loading={isLoading}>
        {columns && columns.length > 0 && (
          <div className={styles.params}>
            <div className={styles.title}>Choose your config for report</div>

            <Form onFinish={onSubmit} form={form} className={styles.form} layout='vertical'>
              <div className={styles.left}>
                <Form.Item
                  name='uidSize'
                  initialValue={UID_SIZES[0].value}
                  label='UID Size'
                  required
                  tooltip={
                    <Note
                      listNote={[
                        {
                          title: 'Small Data',
                          children: [
                            '- If there are less than 1 million rows in the input dataset',
                            '- Runtime: 4min - 10min'
                          ]
                        },
                        {
                          title: 'Big Data',
                          children: [
                            '- If there are more than 1 million rows in the input dataset, only available for demographics',
                            '- Runtime: 30min - 1h or more'
                          ]
                        }
                      ]}
                    />
                  }
                >
                  <Select
                    options={UID_SIZES.map((item) => {
                      return item
                    })}
                  />
                </Form.Item>

                <Form.Item
                  name='date'
                  initialValue={moment()}
                  tooltip={'AutoEDA actually gets data 1 month before the selected month to ensure data availability.'}
                  label='Date'
                >
                  <DatePicker picker='month' onChange={() => form.setFieldValue('referTimeCol', null)} />
                </Form.Item>

                <Form.Item
                  name='referTimeCol'
                  tooltip={'If refer time col is provided, AutoEDA will gets data 1 month the given refer time.'}
                  label='Refer Time Col'
                >
                  <Select
                    placeholder='Choose your refer time column'
                    onChange={() => form.setFieldValue('date', null)}
                    options={columns.map((item) => {
                      return {
                        value: item,
                        label: item
                      }
                    })}
                  />
                </Form.Item>

                <Form.Item
                  name='referTimeFormat'
                  tooltip={'Datetime format for Refer Time Col.'}
                  label='Refer Time Format'
                >
                  <Select
                    allowClear
                    dropdownRender={(menu) => (
                      <>
                        {menu}
                        <Divider style={{ margin: '8px 0' }} />
                        <Space style={{ padding: '0 8px 4px' }}>
                          <Input
                            placeholder='+ Your format'
                            onPressEnter={addItem}
                            ref={inputRef}
                            value={name}
                            onChange={onNameChange}
                          />
                        </Space>
                      </>
                    )}
                    options={items}
                    placeholder='Select your date format'
                  />
                </Form.Item>

                <Form.Item
                  required
                  initialValue={['pred_gender']}
                  tooltip={
                    'All other features including user features + AutoEDA features will be analyzed according to these features. (only available for demographics).'
                  }
                  name='targetFeature'
                  label='Target Feature'
                >
                  <Select
                    placeholder='Choose your target feature'
                    mode='multiple'
                    options={mapUserFeatures(columns, LIST_TARGET_DEFAULT)}
                  />
                </Form.Item>

                <Modal
                  onCancel={() => setIsOpenModalSettings(false)}
                  onOk={() => setIsOpenModalSettings(false)}
                  open={isOpenModalSettings}
                  getContainer={divRef.current}
                >
                  <Form
                    form={form}
                    layout='vertical'
                    onFieldsChange={(changedFields) => {
                      console.log(changedFields)
                    }}
                  >
                    <Form.Item
                      required
                      initialValue={true}
                      tooltip={
                        <Note
                          listNote={[
                            {
                              title: '',
                              children: [
                                'For big data computing, whether to use approximated count distinct to reduce running time. HyperLogLog++ is used in approximated count distinct.',
                                'Runtime with the followings approximated',
                                '- Count Distinct & Percentile: ~30min',
                                '- Either: ~45min',
                                '- None: ~1h30'
                              ]
                            }
                          ]}
                        />
                      }
                      name='countDistinct'
                      label='Approximate Count Distinct'
                    >
                      <Radio.Group disabled={form.getFieldValue('uidSize') === 'small'}>
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                      tooltip={
                        <Note
                          listNote={[
                            {
                              title: '',
                              children: [
                                <div key={'param'}>
                                  {
                                    'For big data computing, whether to use approximated percentiles to reduce running time. Refer to percentile_approx['
                                  }

                                  <a
                                    onClick={() =>
                                      window.open(
                                        'https://spark.apache.org/docs/3.1.3/api/python/reference/api/pyspark.sql.functions.percentile_approx.html',
                                        '_blank'
                                      )
                                    }
                                  >
                                    percentile_approx
                                  </a>

                                  {'] for more details about approximated percentiles. '}
                                </div>,
                                'Runtime with the followings approximated',
                                '- Count Distinct & Percentile: ~30min',
                                '- Either: ~45min',
                                '- None: ~1h30'
                              ]
                            }
                          ]}
                        />
                      }
                      required
                      initialValue={true}
                      name='percentile'
                      label='Approximate Percentile'
                    >
                      <Radio.Group disabled={form.getFieldValue('uidSize') === 'small'}>
                        <Radio value={true}>Yes</Radio>
                        <Radio value={false}>No</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                      tooltip={'Name of column containing src noised id'}
                      required
                      initialValue={columns[0]}
                      name='uidCol'
                      label='UID Col'
                    >
                      <Select
                        options={columns.map((item) => {
                          return {
                            value: item,
                            label: item
                          }
                        })}
                      />
                    </Form.Item>

                    <Form.Item
                      name='compareConfig'
                      tooltip={
                        <Note
                          listNote={[
                            {
                              title: '',
                              children: [
                                '- Compare the input dataset with the selected dataset which can be Zalo A30 or another dataset on HDFS.',
                                '- Available for demographics only.'
                              ]
                            }
                          ]}
                        />
                      }
                      initialValue={typeCompare}
                      label='Compare with'
                      shouldUpdate
                    >
                      <Radio.Group
                        disabled={
                          form.getFieldValue('reportType')?.includes('demographics') &&
                          form.getFieldValue('date') &&
                          form.getFieldValue('date').isAfter(new Date('2022-06'))
                            ? false
                            : true
                        }
                        onChange={(e) => setTypeCompare(e.target.value)}
                      >
                        <Radio value={'Zalo_A30'}>Zalo_A30</Radio>
                        <Radio value={'UID_Path'}>HDFS Path</Radio>
                      </Radio.Group>
                    </Form.Item>

                    <Form.Item
                      tooltip='All configurations like Date, Refer Time Col, Refer Time Format are applied to both HDSF path.'
                      name='inputUIDPath'
                      label='HDFS Path'
                      shouldUpdate
                    >
                      <Input
                        disabled={
                          form.getFieldValue('reportType')?.includes('demographics') &&
                          form.getFieldValue('date') &&
                          form.getFieldValue('date').isAfter(new Date('2022-06')) &&
                          typeCompare &&
                          typeCompare === 'UID_Path'
                            ? false
                            : true
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      required={form.getFieldValue('compareConfig')}
                      name={'nameUIDPath'}
                      label='Left Compare Name'
                      tooltip='Short name for left dataset.'
                    >
                      <Input
                        disabled={
                          form.getFieldValue('reportType')?.includes('demographics') &&
                          form.getFieldValue('date') &&
                          form.getFieldValue('date').isAfter(new Date('2022-06')) &&
                          typeCompare
                            ? false
                            : true
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      required={form.getFieldValue('compareConfig')}
                      name='nameComparePath'
                      label='Right Compare Name'
                      tooltip='Short name for right dataset.'
                    >
                      <Input
                        disabled={
                          form.getFieldValue('reportType')?.includes('demographics') &&
                          form.getFieldValue('date') &&
                          form.getFieldValue('date').isAfter(new Date('2022-06')) &&
                          typeCompare
                            ? false
                            : true
                        }
                      />
                    </Form.Item>

                    <Form.Item
                      name='label'
                      tooltip={
                        <Note
                          listNote={[
                            {
                              title: '',
                              children: [
                                '- Upon selecting any column to be a label, an Automated Machine Learning model will be trained to classify rows in the dataset into labels using features from Feature Store, generating a report comparing importances of Feature Store features in distinguishing the labels.',
                                '- The label column must be binary containing only values 0 and 1.'
                              ]
                            }
                          ]}
                        />
                      }
                      label='Label'
                    >
                      <Select
                        options={columns.map((item) => {
                          return {
                            value: item,
                            label: item
                          }
                        })}
                      />
                    </Form.Item>
                  </Form>
                </Modal>
              </div>

              <div className={styles.split}></div>

              <div className={styles.right}>
                <Form.Item required initialValue={[typeReports[0]]} name='reportType' label='Report Types'>
                  <Select
                    placeholder='Choose your target feature'
                    mode='multiple'
                    options={typeReports.map((item) => {
                      return {
                        value: item,
                        label: item
                      }
                    })}
                  />
                </Form.Item>

                <div className={styles.title}>
                  User features{' '}
                  <span>
                    <Tooltip placement='top' title='Features in the input dataset to be included the analysis.'>
                      <QuestionCircleOutlined />
                    </Tooltip>
                  </span>
                </div>

                {columns.map((item, i) => {
                  return (
                    <div className={styles.selectFeature} key={i}>
                      <Checkbox
                        defaultChecked={i === 0 ? false : true}
                        style={{ width: '200px' }}
                        value={item}
                        onChange={(e) => {
                          if (indexOfArr(listKeepFeatures, e.target.value) < 0 && e.target.checked) {
                            const newListKeep = [...listKeepFeatures]
                            newListKeep.push(e.target.value)
                            setListKeepFeatures(newListKeep)
                          } else if (!e.target.checked && indexOfArr(listKeepFeatures, e.target.value) >= 0) {
                            const newListKeep = [...listKeepFeatures]
                            newListKeep.splice(indexOfArr(listKeepFeatures, e.target.value), 1)
                            setListKeepFeatures(newListKeep)
                          }
                        }}
                      >
                        {item}
                      </Checkbox>

                      <Select
                        // disabled={i === 0 ? true : false}
                        size='middle'
                        style={{ width: '120px' }}
                        defaultValue='auto'
                        options={LIST_TYPE_DATA.map((option) => {
                          return {
                            value: option.value,
                            label: option.label,
                            id: item
                          }
                        })}
                        onSelect={(_: any, option: any) => {
                          const newListFeature = { ...listFeatureTypeMap }
                          if (option.id !== '') {
                            newListFeature[option.id] = option.label
                          }

                          setListFeatureTypeMap(newListFeature)
                        }}
                      />
                    </div>
                  )
                })}

                <Button
                  size='large'
                  className={styles.btnSetting}
                  type='primary'
                  onClick={() => setIsOpenModalSettings(true)}
                >
                  <SettingOutlined /> More settings
                </Button>
              </div>
            </Form>

            <Button onClick={onSubmit} className={styles.btnSubmit} type='primary'>
              Submit
            </Button>
          </div>
        )}
      </Skeleton>

      {!columns && !isLoading && <Empty />}
    </div>
  )
}

export default memo(ChooseParam)

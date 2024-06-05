// src/DynamicForm.tsx

import 'ace-builds/src-noconflict/mode-json'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-monokai'
import { Button, Checkbox, DatePicker, Form, Input, Modal, Radio, Select, Slider, Tooltip } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { Option } from 'antd/lib/mentions'
import React, { memo, useEffect, useState } from 'react'
import AceEditor from 'react-ace'

interface FormItem {
  type: string
  label: string
  data: any // Default data for form item,
  defaultValue: any
  code: any
}

import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons'
import styles from './DynamicForm.module.scss'
import useNotification from '../../../hooks/useNotification'
import moment from 'moment'

interface DynamicFormProps {
  onChange: (form: any) => void
  isPreview?: boolean
  initValue?: any
}

const DynamicForm: React.FC<DynamicFormProps> = ({ onChange, isPreview, initValue }) => {
  const [formItems, setFormItems] = useState<FormItem[]>([])
  const [selectedType, setSelectedType] = useState<string>('input') // Default selected type is input
  const [newItemLabel, setNewItemLabel] = useState<string>('')
  const [defaultData, setDefaultData] = useState<string | any>(null) // Default data for new form item
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [typeModalDefaultData, setTypeModalDefaulData] = useState<'python' | 'json'>('json')

  const { openNotification } = useNotification()
  const [form] = useForm()

  useEffect(() => {
    if (initValue) {
      setFormItems(initValue ?? [])
    }
  }, [initValue])

  console.log('formItems', formItems)

  const handleTypeChange = (value: string) => {
    setSelectedType(value)
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewItemLabel(e.target.value)
  }

  const handleDefaultDataChange = (newData: string) => {
    if (typeModalDefaultData === 'json') {
      setDefaultData(newData)
    }
  }

  const showModal = () => {
    if (newItemLabel.length === 0) {
      openNotification({
        type: 'error',
        message: 'Form Error!',
        description: 'Add label of form before ADD!'
      })

      return
    }
    setIsModalVisible(true)
  }

  const generateDefaultValueInArr = (value: any, type: string) => {
    switch (type) {
      case 'select':
        return value.length > 0 ? value[0] : value
      case 'datepicker':
        return moment(value)
      default:
        return value
    }
  }

  const handleOk = async () => {
    try {
      // Make API call to fetch default data based on the entered Python code
      //   const response = await axios.post('/api/execute', { code: defaultData })
      //   const defaultResult = response.data.result
      const newFormItem: FormItem = {
        code: defaultData,
        type: selectedType,
        label: newItemLabel,
        defaultValue: typeModalDefaultData === 'json' ? JSON.parse(defaultData)?.data : '',
        data: typeModalDefaultData === 'json' ? JSON.parse(defaultData)?.data : ''
      }
      setFormItems([...formItems, newFormItem])
      onChange([...formItems, newFormItem])
      // Clear label input after adding
      setNewItemLabel('')
      setDefaultData(null)
      setTypeModalDefaulData('python')
      setIsModalVisible(false) // Close modal after adding
    } catch (error) {
      console.error('Error executing API:', error)
    }
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const removeFormItem = (index: number) => {
    const updatedFormItems = [...formItems]
    updatedFormItems.splice(index, 1)
    setFormItems(updatedFormItems)
  }

  const onFieldsChange = () => {
    const formSubmit = form.getFieldsValue()

    const newFormItems = formItems.map((item) => {
      return {
        ...item,
        defaultValue: formSubmit[item.label]
      }
    })

    onChange(newFormItems)
  }

  const renderFormItem = (item: FormItem, index: number) => {
    switch (item.type) {
      case 'input':
        return <Input placeholder={`Enter ${item.label}`} />

      case 'datepicker': {
        const date = moment(item.defaultValue)
        return <DatePicker defaultValue={date} placeholder={`Select ${item.label}`} />
      }

      case 'select':
        return (
          <Select placeholder={`Select ${item.label}`}>
            {item.data.map((option: any) => {
              return (
                <Option key={option} value={option}>
                  {option}
                </Option>
              )
            })}
          </Select>
        )

      case 'slider':
        return <Slider defaultValue={item.defaultValue} range />

      case 'checkbox':
        return (
          <Checkbox.Group defaultValue={item.defaultValue}>
            {item.data.map((checkbox: any) => {
              return (
                <Checkbox key={checkbox} value={checkbox}>
                  {checkbox}
                </Checkbox>
              )
            })}
          </Checkbox.Group>
        )

      case 'radio':
        return (
          <Radio.Group>
            {item.data.map((radio: any) => {
              return (
                <Radio key={radio} value={radio}>
                  {radio}
                </Radio>
              )
            })}
          </Radio.Group>
        )

      default:
        return null
    }
  }

  return (
    <div className={styles.root}>
      <Form layout='vertical' form={form} onFieldsChange={onFieldsChange} className={styles.form}>
        {formItems &&
          formItems.map((item, index) => (
            <div className={styles.blockItem} key={item.data}>
              <Form.Item
                className={styles.formItem}
                initialValue={generateDefaultValueInArr(item.defaultValue, item.type)}
                label={item.label}
                name={item.label}
                rules={[{ required: true, message: 'Please enter a label for the field' }]}
              >
                {renderFormItem(item, index)}
              </Form.Item>

              {!isPreview && (
                <div className={styles.groupBtn}>
                  <Button type='link' onClick={() => removeFormItem(index)}>
                    <DeleteOutlined /> Remove
                  </Button>
                  {/* 
                <Button type='primary'>
                  <EditOutlined /> Edit
                </Button> */}
                </div>
              )}
            </div>
          ))}

        {!isPreview && (
          <div className={styles.groupAdd}>
            <Select value={selectedType} onChange={handleTypeChange} style={{ width: 200 }}>
              <Option value='input'>Input</Option>
              <Option value='datepicker'>Date Picker</Option>
              <Option value='select'>Select</Option>
              <Option value='slider'>Slider</Option>
              <Option value='checkbox'>Checkbox</Option>
              <Option value='radio'>Radio</Option>
            </Select>

            <Input placeholder='Enter label for new item' value={newItemLabel} onChange={handleLabelChange} />

            <Button type='dashed' onClick={showModal}>
              <PlusOutlined /> Add Form Item
            </Button>
          </div>
        )}
      </Form>

      <Modal
        destroyOnClose={true}
        title='Define Default Data'
        open={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width={800}
      >
        <Radio.Group
          style={{ marginBottom: '20px' }}
          defaultValue={typeModalDefaultData}
          onChange={(e) => setTypeModalDefaulData(e.target.value)}
        >
          <Radio value={'python'} disabled>
            <Tooltip placement='top' title='Comming soon!'>
              Python
            </Tooltip>
          </Radio>

          <Radio value={'json'}>JSON</Radio>
        </Radio.Group>

        {typeModalDefaultData === 'python' && (
          <AceEditor
            mode='python'
            theme='monokai'
            width='100%'
            height='300px'
            value={defaultData}
            onChange={handleDefaultDataChange}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              useWorker: false,
              showLineNumbers: true,
              tabSize: 2
            }}
          />
        )}

        {typeModalDefaultData === 'json' && (
          <AceEditor
            mode='json'
            theme='github'
            width='100%'
            height='300px'
            value={defaultData}
            onChange={handleDefaultDataChange}
            fontSize={14}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            setOptions={{
              useWorker: false,
              showLineNumbers: true,
              tabSize: 2
            }}
          />
        )}
      </Modal>
    </div>
  )
}

export default memo(DynamicForm)

import { FC, memo, useEffect, useState } from 'react'
import AceEditor from 'react-ace'
import styles from './ModalEditMonitoring.module.scss'
import 'ace-builds/src-noconflict/mode-python'
import 'ace-builds/src-noconflict/theme-monokai'
import 'ace-builds/src-noconflict/ext-language_tools'
import 'ace-builds/src-noconflict/mode-html'

import { Input, Modal } from 'antd'
import DynamicForm from '../DynamicForm/DynamicForm'

interface ModalEditMonitorigProps {
  type: string
  onClose: () => void
  open: boolean
  initValue?: string
  onOk?: (value: string, name: string) => void
  id?: string
  defaultName?: string
}

const ModalEditMonitoring: FC<ModalEditMonitorigProps> = ({
  type,
  onClose,
  open,
  initValue,
  onOk,
  defaultName,
  id
}) => {
  const [value, setValue] = useState<any>(initValue ?? '')
  const [name, setName] = useState(defaultName)

  useEffect(() => {
    if (initValue) setValue(initValue)
  }, [initValue])

  return (
    <div className={styles.root}>
      <Modal
        maskClosable={false} // Disable closing modal by clicking outside
        keyboard={false} // Disable closing modal by pressing Escape key
        style={{ width: 'max-content', minWidth: '700px' }}
        open={open}
        onCancel={onClose}
        destroyOnClose={true}
        okText='Save'
        onOk={() => {
          onOk && onOk(value, name ?? '')
          onClose()
        }}
        okButtonProps={{
          title: 'Save'
        }}
        cancelButtonProps={{
          title: 'Close'
        }}
        title={
          <div style={{ display: 'flex', columnGap: '20px', paddingRight: '20px', alignItems: 'center' }}>
            <Input
              style={{ border: 'None' }}
              placeholder='Your component name...'
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        }
      >
        {type !== 'form' && (
          <AceEditor
            mode={type === 'html' ? 'html' : 'python'}
            theme='monokai'
            //   name='blah2'
            fontSize={16}
            lineHeight={24}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            onChange={(value: string) => setValue(value)}
            value={value ?? ''}
            width='100%'
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              enableBasicAutocompletion: true,
              enableLiveAutocompletion: true,
              enableSnippets: true,
              showLineNumbers: true,
              tabSize: 2
            }}
          />
        )}

        {type === 'form' && (
          <DynamicForm
            initValue={value}
            onChange={(form) => {
              setValue(form)
            }}
          />
        )}
      </Modal>
    </div>
  )
}

export default memo(ModalEditMonitoring)

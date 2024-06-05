import { Checkbox, Dropdown, MenuProps, Modal, Select, Skeleton } from 'antd'
import { FC, memo, useEffect, useRef, useState } from 'react'
import styles from './ComponentMonitoring.module.scss'

import { DeleteOutlined, EditOutlined, ExclamationCircleOutlined, SisternodeOutlined } from '@ant-design/icons'
import { useLocation } from 'react-router-dom'
import { monitoringApi } from '../../../api/monitoringApi'
import useNotification from '../../../hooks/useNotification'
import { doGetComponentInfo, doGetMonitorInfo } from '../../../redux/actions/monitoring'
import { RootState, useAppDispatch, useAppSelector } from '../../../redux/store'
import ModalEditMonitoring from '../ModalEditMonitoring/ModalEditMonitoring'
import PreviewComponent from '../PreviewComponent/PreviewComponent'

interface ComponentMonitoringProps {
  type: string
  id: string
  onDelete: (id: string) => void
  isEdit: boolean
  onCallBackModal?: (isOpen: boolean) => void
}

const { Option } = Select

const ComponentMonitoring: FC<ComponentMonitoringProps> = ({ type, onDelete, id, isEdit, onCallBackModal }) => {
  const containerRef = useRef(null)
  const [isOpenModalEdit, setIsOpenModalEdit] = useState(false)
  const dispatch = useAppDispatch()
  const [isLoading, setIsLoading] = useState(false)
  const [info, setInfo] = useState<any>(null)
  const location = useLocation()
  const { currentMonitorInfo } = useAppSelector((state: RootState) => state.monitor)
  const [isUpdating, setIsUpdating] = useState(false)
  const { openNotification } = useNotification()
  const [isOpenModalEditDependOn, setIsOpenModalEditDependOn] = useState(false)
  const { listComponent } = useAppSelector((state: RootState) => state.monitor)

  const checkIsLayoutExist = () => {
    if (id && currentMonitorInfo) {
      const layout = currentMonitorInfo?.layout

      if (layout) {
        const filter = layout.filter((item: any) => item.id === id)
        if (filter.length > 0) {
          return true
        }
      }
    }

    return false
  }

  console.log('info', info)

  useEffect(() => {
    if (location.pathname !== '/monitoring/create' && checkIsLayoutExist() && !isLoading) {
      setIsLoading(true)
      dispatch(
        doGetComponentInfo({
          id: id
        })
      ).then((res) => {
        if (res.payload.code === 0) {
          setInfo(res.payload.data)
        } else {
          openNotification({
            type: 'error',
            message: res.payload.msg,
            description: ''
          })
        }

        setIsLoading(false)
      })
    }
  }, [id])

  const confirm = () => {
    Modal.confirm({
      title: 'Delete this component?',
      icon: <ExclamationCircleOutlined />,
      content: 'Your component will be deleted from your dashboard.',
      okText: 'Confirm',
      cancelText: 'Cancel',
      onOk: () => onDelete(id)
    })
  }

  const items: MenuProps['items'] =
    location.pathname !== '/monitoring/create' && checkIsLayoutExist() && type === 'form'
      ? [
          {
            key: '1',
            label: (
              <div
                className={styles.edit}
                style={{ color: '#1890ff' }}
                onClick={() => {
                  setIsOpenModalEdit(true)
                  onCallBackModal && onCallBackModal(true)
                }}
              >
                <EditOutlined style={{ color: '#1890ff' }} /> Edit your component
              </div>
            )
          },
          {
            key: '3',
            label: (
              <div
                className={styles.edit}
                style={{ color: '#1890ff' }}
                onClick={() => {
                  setIsOpenModalEditDependOn(true)
                  onCallBackModal && onCallBackModal(true)
                }}
              >
                <SisternodeOutlined style={{ color: '#1890ff' }} /> Trigger Another Chart
              </div>
            )
          },
          {
            key: '2',
            label: (
              <div className={styles.edit} style={{ color: '#ff7875' }} onClick={confirm}>
                <DeleteOutlined style={{ color: '#ff7875' }} /> Delete
              </div>
            )
          }
        ]
      : location.pathname !== '/monitoring/create' && checkIsLayoutExist() && type !== 'form'
      ? [
          {
            key: '1',
            label: (
              <div
                className={styles.edit}
                style={{ color: '#1890ff' }}
                onClick={() => {
                  setIsOpenModalEdit(true)
                  onCallBackModal && onCallBackModal(true)
                }}
              >
                <EditOutlined style={{ color: '#1890ff' }} /> Edit your component
              </div>
            )
          },
          {
            key: '2',
            label: (
              <div className={styles.edit} style={{ color: '#ff7875' }} onClick={confirm}>
                <DeleteOutlined style={{ color: '#ff7875' }} /> Delete
              </div>
            )
          }
        ]
      : [
          {
            key: '2',
            label: (
              <div className={styles.edit} style={{ color: '#ff7875' }} onClick={confirm}>
                <DeleteOutlined style={{ color: '#ff7875' }} /> Delete
              </div>
            )
          }
        ]

  return (
    <div className={styles.root} ref={containerRef}>
      <Skeleton loading={isLoading || isUpdating}>
        {isEdit && (
          <>
            <div className={styles.type}>{type}</div>
            <div className={styles.settings}>
              <Dropdown trigger={['click']} menu={{ items }}>
                <div>
                  <span>.</span>
                  <span>.</span>
                  <span>.</span>
                </div>
              </Dropdown>
            </div>

            <ModalEditMonitoring
              onOk={(e, name) => {
                setIsUpdating(true)

                monitoringApi
                  .updateComponent({
                    code: type !== 'form' ? e : '',
                    id: id,
                    name: name,
                    schedule_timeout: 0,
                    type: type,
                    form: type === 'form' ? e : {},
                    dependOn: info?.depend_on_components
                  })
                  .then((res) => {
                    if (res.code === 0) {
                      openNotification({
                        type: 'success',
                        message: 'Your component has been updated',
                        description: ''
                      })

                      if (type === 'python') {
                        monitoringApi.executeComponentPython({
                          componentId: id,
                          monitorId: currentMonitorInfo?._id
                        })
                      }

                      dispatch(
                        doGetMonitorInfo({
                          id: currentMonitorInfo?._id
                        })
                      )

                      setIsUpdating(false)
                    } else {
                      openNotification({
                        type: 'error',
                        message: res.msg,
                        description: ''
                      })
                      setIsUpdating(false)
                    }
                  })
              }}
              initValue={type !== 'form' ? info?.code : info?.form}
              defaultName={info?.name ?? ''}
              open={isOpenModalEdit}
              onClose={() => {
                setIsOpenModalEdit(false)

                onCallBackModal && onCallBackModal(false)
              }}
              type={type}
            />
          </>
        )}

        {!isEdit && info && <PreviewComponent type={type} info={info} />}

        <Modal
          onCancel={() => setIsOpenModalEditDependOn(false)}
          open={isOpenModalEditDependOn}
          okButtonProps={{ style: { display: 'none' } }}
          cancelText={'Close'}
          title='Set component depends on'
        >
          <div>
            <Checkbox.Group
              defaultValue={info?.depend_on_components}
              onChange={(e) => {
                console.log('e', e)
                monitoringApi
                  .updateComponentDependOn({
                    id: id,
                    dependOn: e
                  })
                  .then((res) => {
                    if (res.code === 0) {
                      openNotification({
                        type: 'success',
                        message: 'Your component has been updated',
                        description: ''
                      })

                      dispatch(
                        doGetMonitorInfo({
                          id: currentMonitorInfo?._id
                        })
                      )

                      setIsUpdating(false)
                    } else {
                      openNotification({
                        type: 'error',
                        message: res.msg,
                        description: ''
                      })
                      setIsUpdating(false)
                    }
                  })
              }}
            >
              {listComponent.map((item) => {
                return (
                  <Checkbox value={item._id} key={item._id}>
                    {item.name}
                  </Checkbox>
                )
              })}
            </Checkbox.Group>
          </div>
        </Modal>
      </Skeleton>
    </div>
  )
}

export default memo(ComponentMonitoring)

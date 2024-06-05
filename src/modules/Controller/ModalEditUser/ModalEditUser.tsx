import { FC, memo, useEffect } from 'react'
import styles from './ModalEditUser.module.scss'
import { Checkbox, Form, Modal, Select } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { RootState, useAppDispatch, useAppSelector } from '../../../redux/store'
import { doGetBlockPermission, doGetMenuReport, doGetTypeReportsCommon } from '../../../redux/actions/masterData'
import {
  doGetMembers,
  doUpdateBlockPermissions,
  doUpdateTypeReportsCommon,
  doUpdateUserMenu
} from '../../../redux/actions/admin'
import useNotification from '../../../hooks/useNotification'

interface ModalEditUserProps {
  isOpen: boolean
  onClose: () => void
  userInfoEditing: any
  pageNumber: number
  pageSize: number
}

const ModalEditUser: FC<ModalEditUserProps> = ({ isOpen, onClose, userInfoEditing, pageNumber, pageSize }) => {
  const [form] = useForm()
  const dispatch = useAppDispatch()
  const { menu, typeReports, blockPermissions } = useAppSelector((state: RootState) => state.masterData)
  const { openNotification } = useNotification()

  useEffect(() => {
    dispatch(doGetMenuReport())
    dispatch(doGetTypeReportsCommon())
    dispatch(doGetBlockPermission())
  }, [])

  return (
    <div className={styles.root}>
      <Modal
        onCancel={onClose}
        okButtonProps={{
          hidden: true
        }}
        cancelText={'Close'}
        destroyOnClose={true}
        open={isOpen}
        title={'Edit user permission'}
      >
        <Form form={form} layout='vertical'>
          <Form.Item required label={'Menu access'}>
            <Select
              mode='multiple'
              defaultValue={userInfoEditing?.menu ?? []}
              onChange={(e) =>
                dispatch(
                  doUpdateUserMenu({
                    id: userInfoEditing._id,
                    menu: e
                  })
                )
                  .then((res) => {
                    if (res.payload.code === 0) {
                      openNotification({
                        type: 'success',
                        message: 'Success!',
                        description: 'User has been updated!'
                      })

                      dispatch(
                        doGetMembers({
                          pageNumber: pageNumber,
                          pageSize: pageSize
                        })
                      )
                    } else {
                      openNotification({
                        type: 'error',
                        message: 'Opps!',
                        description: res.payload.msg
                      })
                    }
                  })
                  .catch((err) => {
                    openNotification({
                      type: 'error',
                      message: 'Opps!',
                      description: err
                    })
                  })
              }
              options={menu.map((item) => {
                return {
                  value: item,
                  label: item
                }
              })}
            />
          </Form.Item>

          <Form.Item required label={'Type report'}>
            <Checkbox.Group
              defaultValue={userInfoEditing?.permission ?? []}
              onChange={(e) =>
                dispatch(
                  doUpdateTypeReportsCommon({
                    id: userInfoEditing._id,
                    // @ts-ignore
                    permission: e
                  })
                )
                  .then((res) => {
                    if (res.payload.code === 0) {
                      openNotification({
                        type: 'success',
                        message: 'Success!',
                        description: 'User has been updated!'
                      })

                      dispatch(
                        doGetMembers({
                          pageNumber: pageNumber,
                          pageSize: pageSize
                        })
                      )
                    } else {
                      openNotification({
                        type: 'error',
                        message: 'Opps!',
                        description: res.payload.msg
                      })
                    }
                  })
                  .catch((err) => {
                    openNotification({
                      type: 'error',
                      message: 'Opps!',
                      description: err
                    })
                  })
              }
              options={typeReports.map((item) => {
                return {
                  value: item,
                  label: item
                }
              })}
            />
          </Form.Item>

          <Form.Item required label={'Block Permissions'}>
            <Checkbox.Group
              defaultValue={userInfoEditing?.block_permissions ?? []}
              onChange={(e) =>
                dispatch(
                  doUpdateBlockPermissions({
                    id: userInfoEditing._id,
                    // @ts-ignore
                    permissions: e
                  })
                )
                  .then((res) => {
                    if (res.payload.code === 0) {
                      openNotification({
                        type: 'success',
                        message: 'Success!',
                        description: 'User has been updated!'
                      })

                      dispatch(
                        doGetMembers({
                          pageNumber: pageNumber,
                          pageSize: pageSize
                        })
                      )
                    } else {
                      openNotification({
                        type: 'error',
                        message: 'Opps!',
                        description: res.payload.msg
                      })
                    }
                  })
                  .catch((err) => {
                    openNotification({
                      type: 'error',
                      message: 'Opps!',
                      description: err
                    })
                  })
              }
              options={blockPermissions.map((item) => {
                return {
                  value: item.value,
                  label: item.label
                }
              })}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default memo(ModalEditUser)

import { FC, memo, useRef, useState } from 'react'

import { SearchOutlined } from '@ant-design/icons'
import { Button, Input, Modal, Skeleton } from 'antd'
import useNotification from '../../../hooks/useNotification'
import { doAddNewMember, doGetMembers, doGetUserProfile } from '../../../redux/actions/admin'
import { RootState, useAppDispatch, useAppSelector } from '../../../redux/store'
import styles from './ModalAddUser.module.scss'
import { doClearUserProfile } from '../../../redux/slice/SliceAPI/admin'

interface ModalAddUserProps {
  isOpen: boolean
  onClose: () => void
  pageNumber: number
  pageSize: number
}

const ModalAddUser: FC<ModalAddUserProps> = ({ isOpen, onClose, pageNumber, pageSize }) => {
  const dispatch = useAppDispatch()
  const [phone, setPhone] = useState('')
  const ref = useRef(null)
  const { openNotification } = useNotification()

  const { isLoading, userProfile } = useAppSelector((state: RootState) => state.admin)

  return (
    <div className={styles.root} ref={ref}>
      <Modal
        destroyOnClose
        // @ts-ignore
        getContainer={ref.current}
        okText={'Add'}
        cancelText={'Close'}
        open={isOpen}
        onOk={() => {
          dispatch(
            doAddNewMember({
              phone: userProfile.phone,
              name: userProfile.fullName,
              avatarUrl: userProfile.avatarUrl
            })
          )
            .then((res) => {
              if (res.payload.code === 0) {
                openNotification({
                  type: 'success',
                  message: 'Success!',
                  description: 'User has been added!'
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

          onClose()
        }}
        onCancel={onClose}
        title={'Create User'}
        okButtonProps={{
          disabled: userProfile ? false : true
        }}
      >
        <div className={styles.search}>
          <Input
            placeholder='Ex: 0112233...'
            value={phone}
            onChange={(e) => {
              setPhone(e.target.value)
              dispatch(doClearUserProfile())
            }}
          />

          <Button
            type={phone.length === 10 ? 'primary' : 'ghost'}
            disabled={phone.length === 10 ? false : true}
            onClick={() => {
              dispatch(doGetUserProfile(phone))
            }}
          >
            <SearchOutlined /> Search
          </Button>
        </div>

        <div className={styles.info}>
          <Skeleton loading={isLoading}>
            {userProfile ? (
              <div className={styles.userInfo}>
                <img src={userProfile.avatarUrl} alt='' />

                <div> {userProfile.fullName}</div>
              </div>
            ) : null}
          </Skeleton>
        </div>
      </Modal>
    </div>
  )
}

export default memo(ModalAddUser)

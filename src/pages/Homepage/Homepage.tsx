import React, { useEffect, useState } from 'react'
import { Button, Form, Input, Modal, Table, Upload, Popconfirm } from 'antd'
import { DeleteOutlined, EditOutlined, PlusOutlined, UploadOutlined } from '@ant-design/icons'
import useUser from '../../hooks/api/useUser'
import withMainLayout from '../../HOC/MainLayout'
import styles from './Homepage.module.scss'
import { IUserInfo } from '../../interfaces/user'

const PAGE_SIZE = 10

const HomePage: React.FC = () => {
  const { isLoading, fetchUsers, users, createUser, updateUser, deleteUser, pageNumber, total, setPageNumber } =
    useUser()
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false)
  const [form] = Form.useForm()
  const [editingUser, setEditingUser] = useState<IUserInfo | null>(null)

  useEffect(() => {
    fetchUsers({ pageNumber, pageSize: PAGE_SIZE })
  }, [pageNumber])

  const handleCreate = () => {
    setIsModalVisible(true)
    setEditingUser(null)
    form.resetFields()
  }

  const handleEdit = (record: IUserInfo) => {
    setIsModalVisible(true)
    setEditingUser(record)
    form.setFieldsValue(record)
  }

  const handleDelete = (id: string) => {
    deleteUser({ id })
  }

  const handleSubmit = async (values: any) => {
    if (editingUser) {
      updateUser({
        id: editingUser?._id ?? '',
        name: values.name,
        age: values.age,
        address: values.address
      })
    } else {
      createUser({
        name: values.name,
        age: values.age,
        address: values.address
      })
    }

    setIsModalVisible(false)
    form.resetFields()
    fetchUsers({ pageNumber, pageSize: PAGE_SIZE })
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Age', dataIndex: 'age', key: 'age' },
    { title: 'Address', dataIndex: 'address', key: 'address' },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: IUserInfo) => (
        <>
          <Button type='link' onClick={() => handleEdit(record)}>
            <EditOutlined /> Edit
          </Button>
          <Popconfirm title='Are you sure to delete?' onConfirm={() => handleDelete(record?._id ?? '')}>
            <Button type='link' danger>
              <DeleteOutlined /> Delete
            </Button>
          </Popconfirm>
        </>
      )
    }
  ]

  return (
    <div className={styles.root}>
      <h1>Welcome to CRUD APP</h1>

      <Button type='primary' className={styles.btnAdd} onClick={handleCreate}>
        <PlusOutlined /> Create New User
      </Button>

      <Table
        columns={columns}
        dataSource={
          users &&
          users.map((item) => {
            return {
              ...item
            }
          })
        }
        loading={isLoading}
        rowKey='_id'
        pagination={{
          current: pageNumber,
          pageSize: PAGE_SIZE,
          total: total,
          onChange: (page) => setPageNumber(page)
        }}
      />
      <Modal
        title={editingUser ? 'Edit User' : 'Create User'}
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form layout='vertical' form={form} onFinish={handleSubmit}>
          <Form.Item name='name' label='Name' rules={[{ required: true, message: 'Please input the name!' }]}>
            <Input />
          </Form.Item>
          <Form.Item name='age' label='Age' rules={[{ required: true, message: 'Please input the age!' }]}>
            <Input type='number' />
          </Form.Item>
          <Form.Item name='address' label='Address' rules={[{ required: true, message: 'Please input the address!' }]}>
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              {editingUser ? 'Update' : 'Create'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}

export default withMainLayout(HomePage)

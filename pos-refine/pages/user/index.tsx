import { ShowButton, useTable } from '@refinedev/antd'
import { List, Table, Button, Space, Modal } from 'antd'
import { User } from 'data'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { deleteUser, getUsers } from 'actions/user'
import { toastLoading, toastLoadingError, toastLoadingSuccess } from 'src/toast/toast'
import { checkPermission } from 'actions/auth'
export default function index() {


  const router = useRouter()
  const { tableProps } = useTable()
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [id, setId] = useState("")
  const [label, setLabel] = useState()
  const [tableData, setTableData] = useState()
  const [deleteButton, setDeleteButton] = useState(false)
  const [createButton, setCreateButton] = useState(false);
  const [viewButton, setViewButton] = useState(false);
  const [editButton, setEditButton] = useState(false);

  useEffect(() => {

    console.log(tableProps)

    async function getData() {

      const resCanDelete = await checkPermission("user delete")
      setDeleteButton(resCanDelete)

      const resCanCreate = await checkPermission("user add")
      setCreateButton(resCanCreate)

      const resCanView = await checkPermission("user show")
      setViewButton(resCanView)

      const resCanEdit = await checkPermission("user edit")
      setEditButton(resCanEdit)



      const data = await getUsers()
      setTableData(data.data)

      // console.log("resCanDelete", resCanDelete)
    }
    getData()

  }, [])


  const showModal = (e: any) => {
    e.preventDefault()
    setId(e.target.getAttribute('data-id'))
    setLabel(e.target.getAttribute('data-label'))
    setIsModalOpen(true);
  };

  const handleOk = async () => {

    const toastId = toastLoading("Deleting...")
    const res = await deleteUser(id)

    async function getData() {
      const data = await getUsers()
      setTableData(data.data)
      console.log("allusers", data.data)
    }

    if (res.data.success === false) {
      toastLoadingError("Delete Failed", toastId)
      setIsModalOpen(false);
    } else {
      getData()
      toastLoadingSuccess("Deleted Successfully", toastId)
      setIsModalOpen(false);
    }

  };


  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <List>


      <Modal title="Delete User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
        <p>Are you sure you want to delete <b>"{label}"</b>?</p>
      </Modal>

      {createButton ?
        < Space wrap>
          <Button type='primary' onClick={() => router.push("/user/create")} >Add User</Button>
        </Space> : ""
      }
      <div style={{ height: "12px" }} ></div>

      <Table dataSource={tableData} loading={false} onChange={tableProps.onChange} scroll={tableProps.scroll} pagination={tableProps.pagination} rowKey="_id" >
        {/* <Table {...tableProps} rowKey="_id" >  */}
        <Table.Column dataIndex="username" title="Username" />
        <Table.Column dataIndex="fullname" title="Fullname" />
        <Table.Column dataIndex={["role", "name"]} title="Role" />
        <Table.Column title="Action" render={(_, record: User) => (
          <Space size="middle">
            {viewButton ?
              <Link href={`/user/show/${record._id}`}>View</Link> : ""}
            {editButton ? <Link href={`/user/edit/${record._id}`}>Edit</Link> : ""

            }
            {
              deleteButton ? <a onClick={showModal} data-id={record._id} data-label={record.username} >Delete</a> : ""
            }

          </Space>
        )} />

      </Table>
    </List >

  )
}

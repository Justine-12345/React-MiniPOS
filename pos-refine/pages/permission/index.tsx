import { useTable } from '@refinedev/antd'
import { List, Table, Button, Space, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { deletePermission, getPermissions } from 'actions/permission'
import { toastLoading, toastLoadingError, toastLoadingSuccess } from 'src/toast/toast'
import { Permission } from 'data'
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

        async function getData() {
            const data = await getPermissions()

            const resCanCreate = await checkPermission("permission add")
            setCreateButton(resCanCreate)

            const resCanDelete = await checkPermission("permission delete")
            setDeleteButton(resCanDelete)

            const resCanView = await checkPermission("permission show")
            setViewButton(resCanView)

            const resCanEdit = await checkPermission("permission edit")
            setEditButton(resCanEdit)

            setTableData(data.data)
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
        const res = await deletePermission(id)

        async function getData() {
            const data = await getPermissions()
            setTableData(data.data)
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


            <Modal title="Delete Permission" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Are you sure you want to delete <b>"{label}"</b>?</p>
            </Modal>

            {createButton ?
                <Space wrap>
                    <Button type='primary' onClick={() => router.push("/permission/create")} >Add Permission</Button>
                </Space> : ""
            }
            <div style={{ height: "12px" }} ></div>

            <Table dataSource={tableData} loading={false} onChange={tableProps.onChange} scroll={tableProps.scroll} pagination={tableProps.pagination} rowKey="_id" >
                {/* <Table {...tableProps} rowKey="_id" >  */}
                <Table.Column dataIndex="name" title="Name" />
                <Table.Column title="Action" render={(_, record: Permission) => (
                    <Space size="middle">
                        {viewButton ?
                            <Link href={`/permission/show/${record._id}`}>View</Link> : ""}
                        {editButton ?
                            <Link href={`/permission/edit/${record._id}`}>Edit</Link> : ""}
                        {deleteButton ?
                            <a onClick={showModal} data-id={record._id} data-label={record.name} >Delete</a> : ""}
                    </Space>
                )} />

            </Table>
        </List>

    )
}

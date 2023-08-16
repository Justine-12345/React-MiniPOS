import { useTable } from '@refinedev/antd'
import { List, Table, Button, Space, Modal } from 'antd'
import { Customer } from 'data'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { deleteCustomer, getCustomers } from 'actions/customer'
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

        async function getData() {
            const data = await getCustomers()
            setTableData(data.data)

            const resCanCreate = await checkPermission("supplier add")
            setCreateButton(resCanCreate)

            const resCanDelete = await checkPermission("supplier delete")
            setDeleteButton(resCanDelete)

            const resCanView = await checkPermission("supplier show")
            setViewButton(resCanView)

            const resCanEdit = await checkPermission("supplier edit")
            setEditButton(resCanEdit)
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
        const res = await deleteCustomer(id)

        async function getData() {
            const data = await getCustomers()
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


            <Modal title="Delete Customer" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Are you sure you want to delete <b>"{label}"</b>?</p>
            </Modal>
            {createButton ?
                <Space wrap>
                    <Button type='primary' onClick={() => router.push("/customer/create")} >Add Customer</Button>
                </Space> : ""
            }
            <div style={{ height: "12px" }} ></div>

            <Table dataSource={tableData} loading={false} onChange={tableProps.onChange} scroll={tableProps.scroll} pagination={tableProps.pagination} rowKey="_id" >
                {/* <Table {...tableProps} rowKey="_id" >  */}
                <Table.Column dataIndex="name" title="Name" />
                <Table.Column dataIndex="address" title="Address" />
                <Table.Column dataIndex="productName" title="Product Name" />
                <Table.Column dataIndex="total" title="Total" />
                <Table.Column title="Expected Date"
                    render={(_, record: Customer) => (
                        <Space size="middle">
                            {new Date(record.expectedDate).toLocaleDateString()}
                        </Space>
                    )}
                />
                <Table.Column dataIndex="contact" title="Contact" />
                <Table.Column dataIndex="note" title="Note" />
                <Table.Column title="Action" render={(_, record: Customer) => (
                    <Space size="middle">
                        {viewButton ?
                            <Link href={`/customer/show/${record._id}`}>View</Link> : ""}
                        {editButton ?
                            < Link href={`/customer/edit/${record._id}`}>Edit</Link> : ""}
                        {deleteButton ?
                            <a onClick={showModal} data-id={record._id} data-label={record.name} >Delete</a> : ""}
                    </Space>
                )} />

            </Table>
        </List >

    )
}

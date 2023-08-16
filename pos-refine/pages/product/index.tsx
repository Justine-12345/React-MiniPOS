import { useTable } from '@refinedev/antd'
import { List, Table, Button, Space, Modal } from 'antd'
import { Product } from 'data'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { deleteProduct, getProducts } from 'actions/product'
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
            const data = await getProducts()
            setTableData(data.data)

            const resCanCreate = await checkPermission("product add")
            setCreateButton(resCanCreate)

            const resCanDelete = await checkPermission("product delete")
            setDeleteButton(resCanDelete)

            const resCanView = await checkPermission("product show")
            setViewButton(resCanView)

            const resCanEdit = await checkPermission("product edit")
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
        const res = await deleteProduct(id)

        async function getData() {
            const data = await getProducts()
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


            <Modal title="Delete Product" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Are you sure you want to delete <b>"{label}"</b>?</p>
            </Modal>
            {createButton ?
                <Space wrap>
                    <Button type='primary' onClick={() => router.push("/product/create")} >Add Product</Button>
                </Space> : ""}
            <div style={{ height: "12px" }} ></div>

            <Table dataSource={tableData} loading={false} onChange={tableProps.onChange} scroll={tableProps.scroll} pagination={tableProps.pagination} rowKey={"_id"} >
                {/* <Table {...tableProps} rowKey="_id" >  */}
                <Table.Column dataIndex="code" title="Code" />
                <Table.Column dataIndex="name" title="Name" />
                <Table.Column title="Category"
                    render={(_, record: Product) => (
                        <Space size="middle">
                            {record.category.name}
                        </Space>
                    )}
                />
                <Table.Column title="Expected Date"
                    render={(_, record: Product) => (
                        <Space size="middle">
                            {new Date(record.arrival).toLocaleDateString()}
                        </Space>
                    )}
                />
                <Table.Column title="Expected Date"
                    render={(_, record: Product) => (
                        <Space size="middle">
                            {new Date(record.expiry).toLocaleDateString()}
                        </Space>
                    )}
                />
                <Table.Column dataIndex="sellingprice" title="Selling Price" />
                <Table.Column dataIndex="originalprice" title="Original Price" />
                <Table.Column dataIndex="profit" title="Profit" />
                <Table.Column title="Supplier"
                    render={(_, record: Product) => (
                        <Space size="middle">
                            {record.supplier.name}
                        </Space>
                    )}
                />
                <Table.Column dataIndex="quantity" title="Quantity" />


                <Table.Column title="Action" render={(_, record: Product) => (
                    <Space size="middle">
                        {viewButton ?
                            <Link href={`/product/show/${record._id}`}>View</Link> : ""}
                        {editButton ?
                            <Link href={`/product/edit/${record._id}`}>Edit</Link> : ""}
                        {deleteButton ?
                            <a onClick={showModal} data-id={record._id} data-label={record.name} >Delete</a> : ""}
                    </Space>
                )} />

            </Table>
        </List>

    )
}

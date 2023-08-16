import { useTable } from '@refinedev/antd'
import { List, Table, Button, Space, Modal, Form, Input } from 'antd'
import { Role, Sales, User } from 'data'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { deleteRole, getRoles } from 'actions/role'
import { toastLoading, toastLoadingError, toastLoadingSuccess } from 'src/toast/toast'
export default function index() {


    const router = useRouter()
    const { tableProps, searchFormProps } = useTable({
        resource: "sale/",
    })
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [id, setId] = useState("")
    const [label, setLabel] = useState()
    const [tableData, setTableData] = useState()


    useEffect(() => {

        async function getData() {
            const data = await getRoles()
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
        const res = await deleteRole(id)

        async function getData() {
            const data = await getRoles()
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

          

            <div style={{ height: "12px" }} ></div>

            <Table {...tableProps} rowKey="_id" >
                {/* <Table {...tableProps} rowKey="_id" >  */}
                <Table.Column dataIndex="invoice" title="Invoice" />
                <Table.Column dataIndex="transactiondate" title="Transaction Id" />
                <Table.Column dataIndex="transactiondate" title="Transaction Date" />
                <Table.Column dataIndex="amount" title="Amount" />
                <Table.Column dataIndex="profit" title="Profit" />
                <Table.Column dataIndex="cash" title="Cash" />
                <Table.Column dataIndex="change" title="Change" />

                <Table.Column title="Action" render={(_, record: Sales) => (
                    <Space size="middle">
                        <Link href={`/sales-report/show/${record._id}`}>View</Link>
                        {/* <a onClick={showModal} data-id={record._id} data-label={record.transactionId} >Delete</a> */}
                    </Space>
                )} />

            </Table>
        </List>

    )
}

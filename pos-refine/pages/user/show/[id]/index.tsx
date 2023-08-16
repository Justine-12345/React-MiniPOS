import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Form, Input, Modal, Space } from 'antd'
import { User } from 'data'
import { getUser, deleteUser } from 'actions/user'
import { toastLoading, toastLoadingError, toastLoadingSuccess } from 'src/toast/toast'
import { checkPermission } from 'actions/auth'
export default function index() {

    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState<User>()
    const router = useRouter()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteButton, setDeleteButton] = useState(false);
   

    useEffect(() => {


        async function userInfo() {
            if (router.isReady) {

                

                const resCanDelete = await checkPermission("user delete")
                setDeleteButton(resCanDelete)

                console.log("router.query.id", router.query.id)
                const res = await getUser(router.query.id)
                console.log("res", res.data)
                setUser(res.data)
            }
        }

        userInfo()



    }, [router.isReady])



    const showModal = (e: any) => {
        e.preventDefault()
        setIsModalOpen(true);
    };

    const handleOk = async () => {

        const toastId = toastLoading("Deleting...")
        const res = await deleteUser(user?._id)

        if (res.data.success === false) {
            toastLoadingError("Delete Failed", toastId)
            setIsModalOpen(false);
        } else {
            router.push("/user")
            toastLoadingSuccess("Deleted Successfully", toastId)
            setIsModalOpen(false);
        }

    };


    const handleCancel = () => {
        setIsModalOpen(false);
    };




    function passHide(pass: string | undefined) {

        let passConv = ""

        if (pass !== undefined) {
            pass.length

            for (let index = 0; index < pass.length; index++) {

                passConv += "*"

            }

            return passConv
        }
        return passConv

    }


    return (
        <>


            <Modal title="Delete User" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <p>Are you sure you want to delete <b>"{user?.username}"</b>?</p>
            </Modal>



            <h2>Show User</h2>

            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                autoComplete="off"
            >


                <Form.Item<User>
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}

                >
                    <Input disabled={true} placeholder={user?.username} />
                </Form.Item>

                <Form.Item<User>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password disabled={true} placeholder={passHide(user?.password)} />
                </Form.Item>

                <Form.Item<User>
                    label="Fullname"
                    name="fullname"
                    rules={[{ required: true, message: 'Please input your fullname!' }]}
                >
                    <Input disabled={true} placeholder={user?.fullname} />
                </Form.Item >

                <Form.Item<User>
                    label="Role"
                    name="role"
                    rules={[{ required: true, message: 'Please input your fullname!' }]}
                >
                    <Input disabled={true} placeholder={user?.role?.name} />
                </Form.Item>



                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" onClick={() => router.push(`/user/edit/${user?._id}`)}  >
                        Edit
                    </Button>&nbsp;
                    {deleteButton ?
                        <Button type="primary" danger={true} onClick={showModal}  >
                            Delete
                        </Button> : ""
                    }
                </Form.Item>
            </Form>
        </>
    )

}

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Button, Form, Input, Select } from 'antd'
import { Role, User } from 'data'
import { getUser } from 'actions/user'
import { toastLoading, toastLoadingSuccess, toastLoadingError, toastError } from 'src/toast/toast'
import { updateUser } from 'actions/user'
import axios from 'axios'
import { BaseURL } from 'src/baseURl'
export default function index() {

    const [loading, setLoading] = useState(false)
    const [roles, setRoles] = useState([])
    const [id, setId] = useState<string | string[]>("")
    const [user, setUser] = useState<User>()
    const router = useRouter()


    const onFinish = async (data: any) => {

        const roleID = data.role

        data.role = { _id: data.role }
        setLoading(true)

        const toastId = toastLoading("Loading...")
        const res = await updateUser(id, data)


        if (res?.data?.success === true) {
            setLoading(false)
            toastLoadingSuccess("Successfully Updated", toastId)
            router.push("/user")
        } else {
            setLoading(false)
            toastLoadingError("An Error Occur", toastId)
        }

    };

    const onFinishFailed = (errorInfo: any) => {
        toastError("An Error Occur")
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

    useEffect(() => {


        async function userInfo() {
            if (router.isReady) {
                console.log("router.query.id", router.query.id)
                setId(router.query.id)
                const res = await getUser(router.query.id)
                res.data.role = res.data.role._id
                console.log("res", res.data)
                setUser(res.data)
            }
        }

        userInfo()



    }, [router.isReady])


    // useEffect(() => {
    //     setUser(user)
    //     console.log("user", user)
    // }, [user])

    useEffect(() => {
        async function getRole() {
            const getRole = await axios.get(`${BaseURL}/role`)
            setRoles(getRole?.data)
        }

        getRole()
    }, [])


    return (
        <>

            <h2>Edit User</h2>
            {user ?
                <Form
                    name="basic"
                    labelCol={{ span: 8 }}
                    wrapperCol={{ span: 16 }}
                    style={{ maxWidth: 600 }}
                    initialValues={user}
                    onFinish={onFinish}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                >


                    <Form.Item<User>
                        label="Username"
                        name="username"
                        rules={[{ required: true, message: 'Please input your username!' }]}

                    >
                        <Input />
                    </Form.Item>

                    <Form.Item<User>
                        label="Password"
                        name="password"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <Input.Password placeholder={passHide(user?.password)} />
                    </Form.Item>

                    <Form.Item<User>
                        label="Fullname"
                        name="fullname"
                        rules={[{ required: true, message: 'Please input your fullname!' }]}
                    >
                        <Input placeholder={user?.fullname} />
                    </Form.Item >

                    <Form.Item name="role" label="Select" >
                        <Select  >
                            {roles?.map((role: Role) => {
                                return (
                                    <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>
                                )
                            })

                            }

                        </Select>
                    </Form.Item>



                    <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                        <Button type="primary" htmlType='submit'  >
                            Save Changes
                        </Button>
                    </Form.Item>
                </Form> : "Loading..."
            }
        </>
    )

}

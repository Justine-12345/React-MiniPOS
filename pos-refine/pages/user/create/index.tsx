import React, { useState, useEffect } from 'react'
import { Input, Form, Button, Select } from 'antd'
import { Role, User } from 'data'
import { BaseURL } from 'src/baseURl';
import axios from 'axios';
import { postUser } from 'actions/user';

import { toastLoading, toastLoadingError, toastLoadingSuccess } from 'src/toast/toast';
import { useRouter } from 'next/router';
export default function index() {


  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const router = useRouter()


  const onFinish = async (data: any) => {

    // const roleID = data.role

    data.role = { _id: data.role }
    setLoading(true)

    const toastId = toastLoading("Loading...")
    const res = await postUser(data)


    if (res?.data?.success === true) {
      setLoading(false)
      toastLoadingSuccess("Successfully Added", toastId)
      router.push("/user")
    } else {
      setLoading(false)
      toastLoadingError("An Error Occur", res.data.message)
    }

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };

  useEffect(() => {
    async function getRole() {
      const getRole = await axios.get(`${BaseURL}/role`)
      setRoles(getRole?.data)
    }

    getRole()
  }, [])

  



  return (
    <>
      <h2>Add User</h2>
      <Form
       name="basic"
       labelCol={{ span: 8 }}
       wrapperCol={{ span: 16 }}
       style={{ maxWidth: 600 }}
       onFinish={onFinish}
       onFinishFailed={onFinishFailed}
       autoComplete="off"
       disabled={loading}
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
          <Input.Password />
        </Form.Item>

        <Form.Item<User>
          label="Fullname"
          name="fullname"
          rules={[{ required: true, message: 'Please input your fullname!' }]}
        >
          <Input />
        </Form.Item>


        <Form.Item name="role" label="Select">
          <Select>
            {roles?.map((role: Role) => {
              return (
                <Select.Option key={role._id} value={role._id}>{role.name}</Select.Option>
              )
            })

            }

          </Select>
        </Form.Item>

        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  )
}

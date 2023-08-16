import React, { useState } from 'react'
import { Button, Carousel, Col, Form, Input, Row } from 'antd';
import { useForm } from '@refinedev/antd';
import { useCreate } from "@refinedev/core";
import { login } from 'actions/auth';
import { useRouter } from 'next/router';

export default function Index() {

    const { mutate } = useCreate();
    const router = useRouter()
    const [error, setError] = useState("")
    const { formProps, saveButtonProps, onFinish } = useForm();


    const handleOnFinish = async (values: any) => {


        const res = await login(values)
        mutate({
            resource: "login/",
            values: values,
            successNotification: false
        },
            {
                onError: (error, variables, context) => {
                    console.log("error", error)
                },
                onSuccess: (data, variables, context) => {
                    if (data.data.success === true) {
                        formProps.form?.resetFields

                        router.push("/dashboard")
                        setError("")
                    } else {
                        setError(data.data.message)
                    }
                },
            },


        );

    };
    const contentStyle: React.CSSProperties = {
        height: '100vh',
        color: '#fff',
        textAlign: 'center',
        background: '#364d79',
    };


    return (
        <>

            {error}

            <Row style={{ height: "100vh", backgroundColor: "red", overflow: "hidden" }}>

                <Col span={15}>

                    <Carousel autoplay>
                        <div >
                            <h3 style={contentStyle}>
                                <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src='https://images.pexels.com/photos/1797428/pexels-photo-1797428.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' />
                            </h3>
                        </div>
                        <div>
                            <h3 style={contentStyle}>
                                <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src='https://images.pexels.com/photos/64613/pexels-photo-64613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' />

                            </h3>
                        </div>
                        <div>
                            <h3 style={contentStyle}>
                                <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src='https://images.pexels.com/photos/53621/calculator-calculation-insurance-finance-53621.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' />

                            </h3>
                        </div>
                        <div>
                            <h3 style={contentStyle}>
                                <img style={{ width: "100%", height: "100%", objectFit: "cover" }} src='https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1' />

                            </h3>
                        </div>
                    </Carousel>

                </Col>

                <Col style={{ backgroundColor: "#61a3ff", display: "flex", justifyContent: "center", alignItems: "center" }} span={9} >

                    <Row style={{ width: "100%" }}>
                        <Col span={24}>
                            <h1 style={{textAlign:"center", fontSize:"90px", color:"white"}} ><span style={{letterSpacing:"-5px"}} >Mini</span><span style={{fontWeight:"800"}} >POS</span></h1>
                        </Col>
                        <Col span={24}>

                            <Form style={{ width: "100%", padding: "0px 50px 0px 50px" }} onFinish={handleOnFinish} layout="vertical">
                               
                                <Form.Item label={<label style={{ color: "white" }}>Username</label>} name="username" rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                    <Input />
                                </Form.Item>

                                <Form.Item label={<label style={{ color: "white" }}>Password</label>} name="password" rules={[
                                    {
                                        required: true,
                                    },
                                ]}>
                                    <Input.Password />
                                </Form.Item>

                                <Form.Item>
                                    <Button type='primary' htmlType='submit'>Login</Button>
                                </Form.Item>

                            </Form>
                        </Col>
                    </Row>
                </Col>

            </Row>

        </>
    )
}

Index.noLayout = true;


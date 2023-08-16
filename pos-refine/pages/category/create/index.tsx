import { Edit, useForm, Create, useCheckboxGroup } from "@refinedev/antd";
import { Form, Input, Select, Checkbox } from "antd";
import { useState, useEffect } from "react";



export default function index() {

    const { formProps, saveButtonProps, onFinish } = useForm({
        successNotification: (data, values, resource) => {
            return {
                message: `Category Successfully created`,
                description: "Success with no errors",
                type: "success",
            };
        },
    });


    const handleOnFinish = (values: any) => {

        onFinish(values);
    };

    return (
        <Create saveButtonProps={saveButtonProps}>
            <Form {...formProps} onFinish={handleOnFinish} layout="vertical">
                <Form.Item label="Name" name="name" rules={[
                    {
                        required: true,
                    },
                ]}>
                    <Input />
                </Form.Item>

            </Form>

        </Create>
    );
}

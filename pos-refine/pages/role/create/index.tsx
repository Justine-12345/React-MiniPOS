import { Edit, useForm, Create, useCheckboxGroup } from "@refinedev/antd";
import { Form, Input, Select, Checkbox } from "antd";
import { useState, useEffect } from "react";



export default function index() {

    const [permissions, setPermissions] = useState([])





    const { formProps, saveButtonProps, onFinish } = useForm({
        successNotification: (data, values, resource) => {
            return {
                message: `Role Successfully created`,
                description: "Success with no errors",
                type: "success",
            };
        },
    });

    const { checkboxGroupProps } = useCheckboxGroup({
        resource: "permission",
        optionLabel: "name",
        optionValue: "_id",
    });

    const handleOnFinish = (values: any) => {


        const rolePermission: any = []

        values.permissions.forEach((per: string) => {
            rolePermission.push({ _id: per })
        });

        values.permissions = rolePermission

        console.log("values", values)

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

                <Form.Item label="Permissions" name="permissions" rules={[
                    {
                        required: true,
                    },
                ]}>
                    <Checkbox.Group {...checkboxGroupProps} />
                </Form.Item>

            </Form>

        </Create>
    );
}

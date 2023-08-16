import { Edit, useForm, useCheckboxGroup } from "@refinedev/antd";
import { Form, Input, Checkbox } from "antd"
export default function index() {

    const { formProps, saveButtonProps, onFinish } = useForm({
        successNotification: (data, values, resource) => {

            return {
                message: `Category Successfully updated`,
                description: "Success with no errors",
                type: "success",
            };
        },

        redirect: "list"
    });


    const handleOnFinish = async (values: any) => {


        onFinish(values)

    };



    return (


        <Edit saveButtonProps={saveButtonProps}>


            < Form
                {...formProps}
                onFinish={handleOnFinish}
                layout="vertical" >

                <Form.Item label="Name" name="name" rules={[
                    {
                        required: true,
                    },
                ]}>
                    <Input />
                </Form.Item>

            </Form >

        </Edit >
    );
}

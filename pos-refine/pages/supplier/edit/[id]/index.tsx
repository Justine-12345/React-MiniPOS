import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd"
export default function index() {

    const { formProps, saveButtonProps, onFinish } = useForm({
        successNotification: (data, values, resource) => {

            return {
                message: `Supplier Successfully updated`,
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


                <Form.Item label="Contact Person" name="contactPerson" rules={[
                    {
                        required: true,
                    },
                ]}>
                    <Input />
                </Form.Item>


                <Form.Item label="Contact Number" name="contact" rules={[
                    {
                        required: true,
                    },
                ]}>
                    <InputNumber style={{ width: "100%" }} stringMode={true} addonBefore="+63" defaultValue={0} min={0} />
                </Form.Item>

                <Form.Item label="Note" name="note" rules={[
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

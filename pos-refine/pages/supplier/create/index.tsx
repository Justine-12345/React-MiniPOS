import { useForm, Create } from "@refinedev/antd";
import { Form, Input, InputNumber } from "antd";



export default function index() {

    const { formProps, saveButtonProps, onFinish } = useForm({
        successNotification: (data, values, resource) => {
            return {
                message: `Supplier Successfully created`,
                description: "Success with no errors",
                type: "success",
            };
        },
    });


    const handleOnFinish = (values: any) => {
        console.log(values)
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
                    <InputNumber style={{width:"100%"}} stringMode={true} addonBefore="+63" defaultValue={0} min={0} />
                </Form.Item>

                <Form.Item label="Note" name="note" rules={[
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

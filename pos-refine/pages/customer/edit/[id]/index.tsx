import { Edit, useForm } from "@refinedev/antd";
import { Form, Input, InputNumber, DatePicker } from "antd"
import dayjs from 'dayjs';

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

    const dateFormat = 'YYYY/MM/DD';


    const handleOnFinish = async (values: any) => {

        onFinish(values)

    };



    return (


        <Edit saveButtonProps={saveButtonProps}>

            {formProps?.initialValues &&
                < Form
                    {...formProps}
                    initialValues={{
                        ...formProps.initialValues,
                        name:formProps.initialValues.name,
                        expectedDate:dayjs(formProps.initialValues.expectedDate, dateFormat)
                        
                    }}
                    onFinish={handleOnFinish}
                    layout="vertical" >
                    <Form.Item label="Name" name="name" rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <Input />
                    </Form.Item>


                    <Form.Item label="Address" name="address" rules={[
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

                    <Form.Item label="ProductName" name="productName" rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <Input />
                    </Form.Item>

                    <Form.Item label="Total" name="total" rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <InputNumber style={{ width: "100%" }} stringMode={true} addonBefore="₱" defaultValue={0} min={0} />
                    </Form.Item>

                    <Form.Item label="Note" name="note" rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="Expected Date"   name={"expectedDate"} rules={[
                        {
                            required: false,
                        },
                    ]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>


                </Form >
            }

        </Edit >
    );
}

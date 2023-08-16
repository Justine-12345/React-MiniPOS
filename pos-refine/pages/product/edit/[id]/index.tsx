import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Form, Input, InputNumber, DatePicker,Select } from "antd"
import dayjs from 'dayjs';

export default function index() {

    const { formProps, saveButtonProps, onFinish } = useForm({
        successNotification: (data, values, resource) => {

            return {
                message: `Product Successfully updated`,
                description: "Success with no errors",
                type: "success",
            };
        },

        redirect: "list"
    });

    const dateFormat = 'YYYY/MM/DD';

    const { selectProps } = useSelect({
        resource: "category",
        optionLabel: "name",
        optionValue: "_id"
    });

    const { selectProps:SupplierSelect } = useSelect({
        resource: "supplier",
        optionLabel: "name",
        optionValue: "_id"
    });



    const handleOnFinish = async (values: any) => {
        values.category = {_id:values.category}
        values.supplier = {_id:values.supplier}
        onFinish(values)

    };



    return (


        <Edit saveButtonProps={saveButtonProps}>

            {formProps?.initialValues &&
                < Form
                    {...formProps}
                    initialValues={{
                        ...formProps.initialValues,
                        category: formProps.initialValues.category._id,
                        arrival: dayjs(formProps.initialValues.arrival, dateFormat),
                        expiry: dayjs(formProps.initialValues.expiry, dateFormat),
                        supplier: formProps.initialValues.supplier._id,
                    
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

                    <Form.Item label="Category" name="category" rules={[
                        {
                            required: true,
                        },
                    ]}>

                        <Select {...selectProps} style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Arrival" name="arrival" rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Expiry" name="expiry" rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <DatePicker style={{ width: "100%" }} />
                    </Form.Item>

                    <Form.Item label="Selling Price" name="sellingprice" rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <InputNumber style={{ width: "100%" }} stringMode={true} defaultValue={0} min={0} />
                    </Form.Item>

                    <Form.Item label="Original Price" name="originalprice" rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <InputNumber style={{ width: "100%" }} stringMode={true} defaultValue={0} min={0} />
                    </Form.Item>




                    <Form.Item label="Supplier" name="supplier" rules={[
                        {
                            required: true,
                        },
                    ]}>

                        <Select {...SupplierSelect} style={{ width: "100%" }} />
                    </Form.Item>


                    <Form.Item label="Quantity" name="quantity" rules={[
                        {
                            required: true,
                        },
                    ]}>
                        <InputNumber style={{ width: "100%" }} stringMode={true} defaultValue={0} min={0} />
                    </Form.Item>


                </Form >
            }

        </Edit >
    );
}

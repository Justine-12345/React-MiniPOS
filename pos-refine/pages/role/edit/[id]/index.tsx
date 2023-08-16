import { Edit, useForm, Create, useCheckboxGroup } from "@refinedev/antd";
import { Form, Input, Select, Checkbox } from "antd";
import { useRouter } from "next/router";
export default function index() {

  const router = useRouter()

  const { formProps, saveButtonProps, onFinish } = useForm({
    successNotification: (data, values, resource) => {
      
      return {
        message: `Role Successfully updated`,
        description: "Success with no errors",
        type: "success",
      };
    },

    redirect:"list"
  });



  const { checkboxGroupProps } = useCheckboxGroup({
    resource: "permission",
    optionLabel: "name",
    optionValue: "_id",
    defaultValue: formProps?.initialValues?.permissions.map((permission: any) => permission._id)
  });


  // const { mutate } = useUpdate();




  const handleOnFinish = async (values: any) => {


    console.log("values", values)

    const rolePermission: any = []

    values.permissions.forEach((per: string) => {
      rolePermission.push({ _id: per })
    });

    values.permissions = rolePermission

  
    onFinish(values)

  };



  return (


    <Edit saveButtonProps={saveButtonProps}>

      {formProps?.initialValues &&
        < Form
          {...formProps}
          onFinish={handleOnFinish}
          initialValues={{
            name: formProps?.initialValues?.name,
            permissions: formProps?.initialValues?.permissions.map((permission: any) => permission._id)
          }
          }

          layout="vertical" >

          <Form.Item label="Name" name="name" rules={[
            {
              required: true,
            },
          ]}>
            <Input />
          </Form.Item>

          <Form.Item label="Permission" name="permissions" rules={[
            {
              required: true,
            },
          ]}>

            <Checkbox.Group {...checkboxGroupProps} />
          </Form.Item>

        </Form >
      }

    </Edit >
  );
}

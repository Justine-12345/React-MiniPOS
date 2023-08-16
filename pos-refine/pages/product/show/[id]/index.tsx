import { Show } from "@refinedev/antd";
import { Typography } from "antd";
import { useShow, useOne } from "@refinedev/core";

const { Title, Text } = Typography;

export default function index() {

  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { data: categoryData, isLoading: categoryIsLoading } =
    useOne({
      resource: "product",
      id: record?._id || "",
      queryOptions: {
        enabled: !!record,
      },
    });

  return (
    <Show isLoading={isLoading}>

      <Title level={5}>Name</Title>
      <Text>{record?.name}</Text>

      <Title level={5}>Code</Title>
      <Text>{record?.code}</Text>

      <Title level={5}>Category</Title>
      <Text>{record?.category.name}</Text>

      <Title level={5}>Arrival</Title>
      <Text>{new Date(record?.arrival).toLocaleDateString()}</Text>

      <Title level={5}>Expiry</Title>
      <Text>{new Date(record?.expiry).toLocaleDateString()}</Text>


      <Title level={5}>Selling Price</Title>
      <Text>{record?.sellingPrice}</Text>


      <Title level={5}>Original Price</Title>
      <Text>{record?.originalPrice}</Text>

      <Title level={5}>Profit</Title>
      <Text>{record?.profit}</Text>

      <Title level={5}>Supplier</Title>
      <Text>{record?.supplier.name}</Text>


      <Title level={5}>Quantity</Title>
      <Text>{record?.quantity}</Text>


    </Show>
  );
};

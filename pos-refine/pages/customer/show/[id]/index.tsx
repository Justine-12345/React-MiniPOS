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
      resource: "customer",
      id: record?._id || "",
      queryOptions: {
        enabled: !!record,
      },
    });

  return (
    <Show isLoading={isLoading}>
    
      <Title level={5}>Name</Title>
      <Text>{record?.name}</Text>

      <Title level={5}>Address</Title>
      <Text>{record?.address}</Text>


      <Title level={5}>Contact</Title>
      <Text>{record?.contact}</Text>


      <Title level={5}>Product Name</Title>
      <Text>{record?.productName}</Text>

      <Title level={5}>Total</Title>
      <Text>₱{record?.total}</Text>

      <Title level={5}>Note</Title>
      <Text>{record?.note}</Text>

      <Title level={5}>Expected Date</Title>
      <Text>{new Date(record?.expectedDate).toLocaleDateString()}</Text>

    </Show>
  );
};

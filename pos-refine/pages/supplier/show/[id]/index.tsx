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
      resource: "supplier",
      id: record?._id || "",
      queryOptions: {
        enabled: !!record,
      },
    });

  return (
    <Show isLoading={isLoading}>
    
      <Title level={5}>Name</Title>
      <Text>{record?.name}</Text>

      <Title level={5}>Contact Person</Title>
      <Text>{record?.contactPerson}</Text>


      <Title level={5}>Contact</Title>
      <Text>{record?.contact}</Text>


      <Title level={5}>Note</Title>
      <Text>{record?.note}</Text>

    </Show>
  );
};

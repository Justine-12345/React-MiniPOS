import { Show, MarkdownField } from "@refinedev/antd";
import { Typography } from "antd";
import { useShow, useOne } from "@refinedev/core";

const { Title, Text } = Typography;

export default function index() {

  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const { data: categoryData, isLoading: categoryIsLoading } =
    useOne({
      resource: "permission",
      id: record?._id || "",
      queryOptions: {
        enabled: !!record,
      },
    });

  return (
    <Show isLoading={isLoading}>
    
      <Title level={5}>Name</Title>
      <Text>{record?.name}</Text>

 


    </Show>
  );
};

import { Show, MarkdownField } from "@refinedev/antd";
import { Col, Row, Typography } from "antd";
import { useShow, useOne, BaseRecord } from "@refinedev/core";
import { Order, Sales } from "data";
import Link from "next/link";

const { Title, Text } = Typography;

export default function index() {



  const { queryResult } = useShow();
  const { data, isLoading } = queryResult;
  const record: Sales | BaseRecord | undefined = data?.data;

  const { data: categoryData, isLoading: categoryIsLoading } =
    useOne({
      resource: "sale/",
      id: record?._id || "",
      queryOptions: {
        enabled: !!record,
      },
    });

  return (
    <>

    
      <Show isLoading={isLoading}>





        {/* {JSON.stringify(record)} */}
        <Title level={5}>Invoice</Title>
        <Text>{record?.invoice}</Text>

        <Title level={5}>Transaction ID</Title>
        <Text>{record?.transactionid}</Text>

        <Title level={5}>Transaction Date</Title>
        <Text>{record?.transactiondate}</Text>

        <Title level={5}>Order</Title>
        <Text>
          <Row>
            <Col span={12} >

              {record?.orders.map((order: Order) => {
                return (
                  <Row>
                    <Col span={12}>
                      {order.product.name} x {order.quantity}
                    </Col>
                    <Col style={{ padding: "0px 8px 0px 8px" }} >
                      {order.amount}
                    </Col>
                  </Row>)
              })}


              <Row style={{ fontWeight: "650" }} >
                <Col span={12}>
                  Total:
                </Col>
                <Col style={{ borderTop: "1px solid black", padding: "0px 8px 0px 8px" }} >
                  {record?.amount}
                </Col>
              </Row>

            </Col>
          </Row>
        </Text>

        <Title level={5}>Profit</Title>
        <Text>{record?.profit}</Text>

        <Title level={5}>Cash</Title>
        <Text>{record?.cash}</Text>

        <Title level={5}>Change</Title>
        <Text>{record?.change}</Text>

        {record?.customer?.name &&
          <Title level={5}>Customer</Title>
        }


        <Text>{record?.customer?.name}</Text>






      </Show>
    </>
  );
};

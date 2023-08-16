import { useTable, useSelect, useForm } from '@refinedev/antd'
import { useCreate } from "@refinedev/core";
import { List, Table, Button, Form, Space, Modal, Select, InputNumber, Row, Col, Spin } from 'antd'
import { Customer, OrderProduct, Product } from 'data'
import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { deleteCustomer, getCustomers } from 'actions/customer'
import { toastLoading, toastLoadingError, toastLoadingSuccess } from 'src/toast/toast'
import { BaseRecord } from '@refinedev/core'
export default function index() {


    const router = useRouter()
    const [tableData, setTableData] = useState<any>([])
    const [product, setProduct] = useState<{ value: string, label: string; }>()
    const [qty, setQtq] = useState(1)
    const [cash, setCash] = useState(0)
    const [customer, setCustomer] = useState<{ value: string, label: string; }>()
    const [totalAmount, setTotalAmount] = useState(0)
    const [totalProfit, setTotalProfit] = useState(0)
    const [loading, setLoading] = useState(false)
    const { mutate } = useCreate();
    let toastId: any
    const { tableProps: products } = useTable({
        resource: "product/",
    });

    const { selectProps } = useSelect({
        resource: "product/",
        optionLabel: "name",
        optionValue: "_id"
    });

    const { selectProps: customerSelect } = useSelect({
        resource: "customer/",
        optionLabel: "name",
        optionValue: "_id"
    });


    const [form] = Form.useForm();

    useEffect(() => {
        console.log(tableData)

        let totAmount: number = 0
        let totProfit: number = 0
        tableData.forEach((prod: OrderProduct | BaseRecord) => {
            totAmount += prod?.quantity * prod?.price
            totProfit += prod?.profit
        });

        setTotalAmount(totAmount)

        setTotalProfit(totProfit)

    }, [tableData])

    const onAdd = () => {


        let selectedProduct: Product | BaseRecord | undefined


        products.dataSource?.forEach((prod: Product | BaseRecord) => {
            if (prod._id === product) {
                selectedProduct = prod
            }
        });
        if (selectedProduct) {

            const orderedProduct: OrderProduct = {
                _id: selectedProduct._id,
                code: selectedProduct.code,
                name: selectedProduct.name,
                category: selectedProduct.category.name,
                price: selectedProduct.sellingprice,
                quantity: qty,
                amount: selectedProduct.sellingprice * qty,
                profit: selectedProduct.profit * qty
            }

            setTableData([...tableData, orderedProduct])
            setProduct({ label: "", value: "" })
            setQtq(1)
            form.resetFields()
        }


    }


    const onChangeProduct = (value: { value: string; label: string; }) => {
        setProduct(value)
    };

    const onChangeQty = (value: any) => {
        setQtq(value)
    };

    const onChangeCustomer = (value: any) => {
        setCustomer(value)
    };

    const onChangeQtyInTable = (newQty: any, index: any) => {
        console.log("newQty", newQty)
        const updateItem = [...tableData]
        let itemToUpdate = updateItem[index]


        let selectedProduct: Product | BaseRecord | undefined


        products.dataSource?.forEach((prod: Product | BaseRecord) => {
            if (prod._id === itemToUpdate._id) {
                selectedProduct = prod
            }
        });

        const orderedProduct: OrderProduct = {
            _id: selectedProduct?._id,
            code: selectedProduct?.code,
            name: selectedProduct?.name,
            category: selectedProduct?.category.name,
            price: selectedProduct?.sellingprice,
            quantity: newQty,
            amount: selectedProduct?.sellingprice * newQty,
            profit: selectedProduct?.profit * newQty
        }

        updateItem[index] = orderedProduct

        setTableData(updateItem)

    }

    const onRemove = (indx: any) => {
        const allProd = [...tableData]

        allProd.splice(indx, 1);
        console.log("allProd", allProd)
        setTableData(allProd)


    }

    const onCheckout = () => {


        setLoading(true)
        toastId = toastLoading("Submitting...")
        let allOrders: any = []


        tableData.forEach((data: OrderProduct) => {

            allOrders.push({
                product: { _id: data._id },
                quantity: data.quantity
            })
        })

        const orderInfo = {
            customer: { "_id": customer },
            cash: cash,
            orders: allOrders
        }


        console.log(orderInfo)

        mutate(
            {
                resource: "sale/",
                values: orderInfo,
                successNotification: false
            },
            {
                onError: (error: any, variables: any, context: any) => {
                    console.log("error", error)
                    console.log("variables", variables)
                    console.log("context", context)
                    setLoading(false)
                },
                onSuccess: (data: any, variables: any, context: any) => {
                    console.log("data", data)
                    console.log("variables", variables)
                    console.log("context", context)
                    setLoading(false)
                    if (data.data.success === true) {
                        toastLoadingSuccess("Successfully submitted", toastId)
                        setCash(0)
                        setCustomer({ label: "", value: "" })
                        setTableData([])
                        form.resetFields()
                    } else {

                        let errStr = ""

                        data.data.message.forEach((err: string) => {
                            errStr += err + "\n"
                        });

                        toastLoadingError(errStr, toastId)
                    }


                },

            },

        );

    }

    const options = selectProps.options || [];
    const customerOptions = customerSelect.options || [];



    return (
        <>
            {/* {JSON.stringify(selectProps.options)} */}

            < Form form={form} layout='vertical' >
                <Row>
                    <Col span={8}>
                        <Form.Item label="Product" name="product" rules={[
                            {
                                required: true,
                            },
                        ]}>



                            <Select
                                {...selectProps}
                                showSearch
                                placeholder="Select a product"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={onChangeProduct}
                                options={[...options]}
                            />
                        </Form.Item>

                    </Col>



                    <Col style={{ paddingLeft: "2px" }} span={3}>
                        <Form.Item label="Quantity" name="quantity" rules={[
                            {
                                required: true,
                            },
                        ]}>
                            <InputNumber style={{ width: "100%" }} value={qty} onChange={onChangeQty} min={1} defaultValue={1} />


                        </Form.Item>
                    </Col>



                    <Col span={2} style={{ padding: "2px" }}>
                        <Form.Item label="  " >
                            <Button style={{ width: "100%" }} onClick={onAdd} type="primary" >
                                Add
                            </Button>
                        </Form.Item>
                    </Col>



                    <Col span={11} style={{ display: "flex", justifyContent: "end" }} >

                        <Form.Item style={{ width: "80%" }} label="  " >
                            <Select
                                style={{ width: "100%", marginBottom: "8px" }}
                                {...customerSelect}

                                value={customer}
                                showSearch
                                placeholder="Select a customer"
                                optionFilterProp="children"
                                filterOption={(input, option) =>
                                    String(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
                                }
                                onChange={onChangeCustomer}
                                options={[{ value: "", label: "" }, ...customerOptions]}
                            />

                            <InputNumber prefix="₱" style={{ width: '100%', marginBottom: "8px" }} value={cash} onChange={(cashVal: any) => setCash(cashVal)} min={0} />

                            <Button onClick={onCheckout} style={{ backgroundColor: "green", marginBottom: "8px", width: "100%", fontWeight: "600" }} disabled={(tableData.length <= 0 || cash <= 0) || (cash > 0 && cash < totalAmount) || loading} type="primary">

                                {loading ? "Submitting..." : "Checkout"

                                }
                            </Button>

                            {cash > 0 && cash < totalAmount ?
                                <span style={{ color: "red" }} ><i>(Insufficient Cash)</i></span> : ""
                            }

                        </Form.Item>
                    </Col>
                </Row>
            </Form >

            <List>
                <h2 >Total Amout: {totalAmount}</h2>
                <h4>Total Profit: {totalProfit} </h4>
                <h4>Change: {cash - totalAmount > 0 ? cash - totalAmount : "0"} </h4>
                <Table dataSource={tableData} rowKey="_id" >
                    <Table.Column dataIndex="code" title="Code" />
                    <Table.Column dataIndex="name" title="Name" />
                    <Table.Column dataIndex="category" title="Category" />
                    <Table.Column dataIndex="price" title="Price" />
                    <Table.Column title="Quantity"
                        render={(_, record: OrderProduct, indx) => (
                            <Space size="middle">
                                <InputNumber defaultValue={record?.quantity} onChange={(newQty) => onChangeQtyInTable(newQty, indx)} min={1} />
                            </Space>
                        )}
                    />

                    <Table.Column dataIndex="amount" title="Amount" />
                    <Table.Column dataIndex="profit" title="Profit" />
                    <Table.Column title="Action"
                        render={(_, record: OrderProduct, indx) => (
                            <Button onClick={() => onRemove(indx)} type="primary" danger>
                                Remove
                            </Button>
                        )}
                    />
                </Table>

            </List>
        </>
    )
}

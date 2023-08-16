import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { useEffect, useState } from 'react';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    BarElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);
import { getDashboard } from 'actions/dashboard';
import { json } from 'react-router-dom';
import { title } from 'process';
import { Card, Col, Row } from 'antd';


export default function index() {

    const [salesPerMonthLabel, setSalesPerMonthLabel] = useState<string[]>([])
    const [salesPerMonthValue, setSalesPerMonthValue] = useState<number[]>([])

    const [profitPerMonthLabel, setProfitPerMonthLabel] = useState<string[]>([])
    const [profitPerMonthValue, setProfitPerMonthValue] = useState<number[]>([])

    const [bestSellingLabel, setBestSellingLabel] = useState<string[]>([])
    const [bestSellingValue, setBestSellingValue] = useState<number[]>([])

    const [totalSales, setTotalSales] = useState<number[]>([])
    const [totalProfit, setTotalProfit] = useState<number[]>([])
    const [totalProduct, setTotalProduct] = useState<number[]>([])


    const labels = [
        "January", "February", "March", "April",
        "May", "June", "July", "August",
        "September", "October", "November", "December"
    ]



    useEffect(() => {

        async function getDashboardData() {
            const res = await getDashboard()
            const salesPerMonthRootRes = res.data.salesPerMonth
            const profitPerMonthRootRes = res.data.profitPerMonth
            const bestSellingRootRes = res.data.bestSelling

            setTotalSales(res.data.totalSalesProfit[0].totalSale)
            setTotalProfit(res.data.totalSalesProfit[0].totalProfit)
            setTotalProduct(res.data.totalProduct[0].totalProduct)


            salesPerMonthRootRes.forEach((sales: any) => {
                setSalesPerMonthLabel(oldArry => [...oldArry, labels[sales._id.month - 1] + " " + sales._id.year])
                setSalesPerMonthValue(oldArry => [...oldArry, sales.total_sale_month])
            });

            profitPerMonthRootRes.forEach((sales: any) => {
                setProfitPerMonthLabel(oldArry => [...oldArry, labels[sales._id.month - 1] + " " + sales._id.year])
                setProfitPerMonthValue(oldArry => [...oldArry, sales.total_profit_month])
            });

            bestSellingRootRes.forEach((sales: any) => {
                console.log("sales", sales)
                setBestSellingLabel(oldArry => [...oldArry, sales._id.product])
                setBestSellingValue(oldArry => [...oldArry, sales.total])
            });


        }
        getDashboardData()


    }, [])

    const getOption = (title: string) => {
        const option = {
            responsive: true,
            plugins: {
                legend: {
                    position: 'top' as const,
                },
                title: {
                    display: true,
                    text: title,
                },
            },
        };

        return option
    }

    const getData = (label: string[], value: number[]) => {

        const data = {
            labels: label,
            datasets: [
                {
                    label: "Amount",
                    data: value,
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: ['rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)', 'rgba(153, 102, 255, 0.5)', 'rgba(255, 159, 64, 0.5)', 'rgba(255, 99, 132, 0.5)', 'rgba(54, 162, 235, 0.5)', 'rgba(255, 206, 86, 0.5)', 'rgba(75, 192, 192, 0.5)'],
                }
            ],
        }
        return data

    }

    return (
        <>
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="Total Sales" bordered={false}>
                        <h1 >{totalSales}</h1>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Total Profit" bordered={false}>
                        <h1 >{totalProfit}</h1>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="Total Product" bordered={false}>
                        <h1 >{totalProduct}</h1>
                    </Card>
                </Col>
            </Row>

            <Row style={{ marginTop: "24px" }} gutter={16}>
                <Col span={12}>
                    <Card bordered={false}>
                        <Line options={getOption("Sale per Month")} data={getData(salesPerMonthLabel, salesPerMonthValue)} />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card bordered={false}>
                        <Line options={getOption("Profit per Month")} data={getData(profitPerMonthLabel, profitPerMonthValue)} />
                    </Card>

                </Col>
            </Row>

            <Row style={{ marginTop: "24px" }} gutter={16}>
                <Col span={6}></Col>
                <Col span={12}>
                    <Card bordered={false}>
                        <Bar options={getOption("Best Selling")} data={getData(bestSellingLabel, bestSellingValue)} />
                    </Card>
                </Col>
                <Col span={6}></Col>
            </Row>








        </>
    )
}

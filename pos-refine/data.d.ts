import { type } from "os";

type User = {
    _id: string;
    username: string;
    password: string;
    fullname: string;
    role: Role
}

type Role = {
    _id: string;
    name?: string;
    permissions?: Permission[]
}

type Permission = {
    _id: string;
    name: string;
}

type Supplier = {
    _id: string;
    name: string;
    contactPerson: string;
    contact: string;
    note: string;
}


type Customer = {
    _id: string;
    name: string;
    address: string;
    contact: string;
    productName: string;
    total: string;
    note: string;
    expectedDate: string;
}

type Category = {
    _id: string;
    name: string;
}


type Product = {
    _id: string;
    code: string;
    name: string;
    category: Category;
    arrival: string;
    expiry: string;
    sellingprice: string;
    originalprice: string;
    profit: string;
    supplier: Supplier;
    quantity: string;
}

type Order = {
    product: Product
    quantity: int
    amount: int
}

type Sales = {
    _id: string
    customer: Customer
    orders: Order[]
    amount: int
    profit: int
    cash: int
    change: int
    invoice: string
    transactionid: string
    transactiondate: string
}

type IPost = {
    id: number;
    title: string;
    status: "published" | "draft" | "rejected";
}

type OrderProduct = {
    _id: string;
    code: string;
    name: string;
    category: Category;
    price: number;
    quantity: number;
    amount: number;
    profit: number;
    
}


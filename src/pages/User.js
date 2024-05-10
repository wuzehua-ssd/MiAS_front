import { Layout, Menu } from "antd";
import './User.css';
import UserOrderList from "../components/user/UserOrderList";
import UserOrderCreate from "../components/user/UserOrderCreate";
import { useState } from "react";

const { Header, Sider } = Layout;

const ITEMS = [
    {
        label: "服务进度",
        key: "serviceProgress",
        children: [
            { label: "工单列表", key: "/userOrderList"},
            { label: "工单提交", key: "/orderCreate"},
        ],
    }
]

function UserHome() {
    const [selectedMenuItem, setSelectedMenuItem] = useState("/userOrderList");

    const handleMenuSelect = ({ key }) => {
        setSelectedMenuItem(key);
    };

    const renderContent = () => {
        switch (selectedMenuItem) {
            case "/userOrderList":
              return <UserOrderList />;
            case "/orderCreate":
              return <UserOrderCreate />;
            default:
              return null;
        }
    }

    return (
        <Layout>
            <Header className="user_header">
                <div className="user_logo">
                    <img src="Mi.svg" alt="" width={24} height={24} />
                    <span className="logo_text">小米售后维修服务工单履约系统</span>
                </div>
            </Header>
            <Layout>
                <Sider width={200}>
                    <Menu 
                        mode="inline" 
                        defaultSelectedKeys={["/userOrderList"]} 
                        defaultOpenKeys={["serviceProgress"]} 
                        style={{height: "93vh", borderRight: 0}}
                        items={ITEMS}
                        onSelect={handleMenuSelect}
                    />
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    {renderContent()}
                </Layout>
            </Layout>
        </Layout>
    )
}

export default UserHome;
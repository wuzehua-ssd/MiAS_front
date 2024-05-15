import { Dropdown, Layout, Menu } from "antd";
import './User.css';
import UserOrderList from "../components/user/UserOrderList";
import UserOrderCreate from "../components/user/UserOrderCreate";
import { useState } from "react";
import { DownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';

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

    const navigate = useNavigate();

    const handleLoginout = () => {
        navigate('/');
    }

    const items = [
        {
            key: '1',
            danger: true,
            label: (
                <a onClick={handleLoginout}>
                    退出登录
                </a>
            ),
        },
    ]

    const handleMenuSelect = ({ key }) => {
        setSelectedMenuItem(key);
    };

    const switchCreate = () => {
        setSelectedMenuItem("/orderCreate");
    }

    const renderContent = () => {
        switch (selectedMenuItem) {
            case "/userOrderList":
              return <UserOrderList sonSwitch={switchCreate} />;
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
                    <div className="logo_text">
                        <img src="Mi.svg" alt="" width={24} height={24} />
                        <span style={{marginLeft:12}}>小米售后维修服务工单履约系统</span>
                    </div>
                    <div className="user_dropdown">
                        <Dropdown menu={{ items }}>
                            <a onClick={(e) => e.preventDefault()}>
                                用户
                                <DownOutlined />
                            </a>
                        </Dropdown>
                    </div>       
                </div>
            </Header>
            <Layout>
                <Sider width={200}>
                    <Menu 
                        mode="inline" 
                        selectedKeys={[selectedMenuItem]}
                        defaultSelectedKeys={["/userOrderList"]} 
                        defaultOpenKeys={["serviceProgress"]} 
                        style={{height: "92vh", borderRight: 0}}
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
import { Dropdown, Layout, Menu, message } from "antd";
import './Engineer.css';
import { DownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import EngineerOrderList from "../components/engineer/EngineerOrderList";

const { Header, Sider } = Layout;

const ITEMS = [
    {
        label: "工单处理",
        key: "orderProcess",
        children: [
            { label: "工单列表", key: "/engineerOrderList"},
        ],
    }
]

function EngineerHome() {
    const [selectedMenuItem, setSelectedMenuItem] = useState("/engineerOrderList");

    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("user")) {
            // console.log(userData);
            message.error("请先登录！");
            navigate('/');
        }
    }, [])

    const handleLoginout = () => {
        localStorage.removeItem("user");
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

    return (
        <Layout>
            <Header className="engineer_header">
                <div className="engineer_logo">
                    <div className="logo_text">
                        <img src="Mi.svg" alt="" width={24} height={24} />
                        <span style={{marginLeft:12}}>小米售后维修服务工单履约系统</span>
                    </div>
                    <div className="engineer_dropdown">
                        <Dropdown menu={{ items }}>
                            <a onClick={(e) => e.preventDefault()}>
                                工程师
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
                        defaultSelectedKeys={["/engineerOrderList"]} 
                        defaultOpenKeys={["orderProcess"]} 
                        style={{height: "93vh", borderRight: 0}}
                        items={ITEMS}
                        onSelect={handleMenuSelect}
                    />
                </Sider>
                <Layout style={{ padding: '0 24px 24px' }}>
                    <EngineerOrderList />
                </Layout>
            </Layout>
        </Layout>
    )
}

export default EngineerHome;
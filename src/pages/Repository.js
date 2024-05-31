import { Dropdown, Layout, Menu, message } from "antd";
import { useEffect, useState } from "react";
import './Repository.css';
import { DownOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom';
import InventoryList from "../components/repository/InventoryList";
import AddInventory from "../components/repository/AddInventory";

const { Header, Sider } = Layout;

const ITEMS = [
    {
        label: "库存管理",
        key: "repositoryManage",
        children: [
            { label: "物料列表", key: "/inventoryList"},
            { label: "新增物料", key: "/addInventory"},
        ],
    }
]

function RepositoryHome() {
    const [selectedMenuItem, setSelectedMenuItem] = useState("/inventoryList");

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

    const switchCreate = () => {
        setSelectedMenuItem("/addInventory");
    }

    const switchList = () => {
        setSelectedMenuItem("/inventoryList");
    }

    const renderContent = () => {
        switch (selectedMenuItem) {
            case "/inventoryList":
              return <InventoryList sonSwitch={switchCreate} />;
            case "/addInventory":
              return <AddInventory sonSwitch={switchList}/>;
            default:
              return null;
        }
    }

    return (
        <Layout>
            <Header className="repository_header">
                <div className="repository_logo">
                    <div className="logo_text">
                        <img src="Mi.svg" alt="" width={24} height={24} />
                        <span style={{marginLeft:12}}>小米售后维修服务工单履约系统</span>
                    </div>
                    <div className="repository_dropdown">
                        <Dropdown menu={{ items }}>
                            <a onClick={(e) => e.preventDefault()}>
                                网点库管
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
                        defaultSelectedKeys={["/inventoryList"]} 
                        defaultOpenKeys={["repositoryManage"]} 
                        style={{height: "108vh", borderRight: 0}}
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

export default RepositoryHome;
import { Breadcrumb, Layout, theme, Form, Select, Button, Table, Space, Modal, Input, message } from "antd";
import { useState, useEffect } from "react";
import { inventoryList, updateInventory } from "../../api/Inventory";

const { Content } = Layout;

const inventoryClassList = [
    {
        value: 0,
        label: '小米手机',
    },
    {
        value: 1,
        label: '小米笔记本电脑',
    },
    {
        value: 2,
        label: '小米平板',
    },
    {
        value: 3,
        label: '小米电视',
    },
    {
        value: 4,
        label: '小米空调',
    },
    {
        value: 5,
        label: '小米SU7',
    },
];

const breadItem = [
    {
        title: '库存管理',
    },
    {
        title: '物料列表',
    },
];

function InventoryList() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [dataSource, setDataSource] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [isUpdateInventoryModalVisible, setIsUpdateInventoryModalVisible] = useState(false);

    const columns = [
        {
            title: "物料编号",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "物料名称",
            dataIndex: "inventoryName",
            key: "inventoryName",
        },
        {
            title: "物料分类",
            dataIndex: "inventoryClassName",
            key: "inventoryClassName",
        },
        {
            title: "物料数量",
            dataIndex: "inventoryNumber",
            key: "inventoryNumber",
        },
        {
            title: "物料单价",
            dataIndex: "inventoryPrice",
            key: "inventoryPrice",
        },
        {
            title: "操作",
            key: "action",
            render: (_, record) => {
                const handleShowUpdateInventory = () => {
                    setSelectedInventory(record);
                    setIsUpdateInventoryModalVisible(true);
                };
                return (
                    <Space>
                        <a onClick={(e) => {e.stopPropagation(); handleShowUpdateInventory()}}>库存物料管理</a>
                    </Space>
                );
            }
        }
    ]

    const [pagination, setPagination] = useState({
        current: 1, // 当前页码
        pageSize: 10, // 每页记录数
        total: 0, // 总记录数,初始化为0
        showSizeChanger: true, // 允许修改分页大小
        showTotal: (total, range) => `共 ${total} 条记录`, // 显示总记录数
    });

    const handleTableChange = (pagination, filters, sorter) => {
        setPagination((prevPagination) => ({
            ...prevPagination,
            ...pagination,
        }));
        setPageNum(pagination.current);
        setPageSize(pagination.pageSize);
    };

    useEffect(() => { 
        const fetchData = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user") || '{}');
                const userId = user.id;
                const queryData = {
                    pageNum,
                    pageSize,
                    userId,
                }
                // 发起后端接口请求
                const response = await inventoryList(queryData); // 替换为实际的后端接口调用
    
                // 从响应中提取数据并更新 dataSource
                const data = response.data; // 假设响应中的数据为 data 字段
                setDataSource(data);
                const total = data === null ? 0 : data[0].totalNum;
                // console.log(total);
                setPagination(prevPagination => ({
                    ...prevPagination,
                    total,
                }));
            } catch (error) {
                // 处理请求错误
                console.error('Error fetching data:', error);
            }
        };
        fetchData(); // 调用异步函数进行数据获取
    }, []);

    const handleSearchFish = (values) => {
        const { inventoryClass } = values;
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        const userId = user.id;
        const queryData = {
            pageNum,
            pageSize,
            userId,
            inventoryClass
        }
        inventoryList(queryData)
        .then(response => {
            const data = response.data;
            setDataSource(data);
            const total = data === null ? 0 : data[0].totalNum;
            setPagination(prevPagination => ({
                ...prevPagination,
                total,
            }));
        })
        .catch(error => {
            console.log(error);
        });
    }

    const handleUpdateInventory =(values) => {
        const { inventoryName, inventoryClass, inventoryNumber, inventoryPrice } = values;
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        const userId = user.id;
        const queryData = {
            userId,
            id: selectedInventory.id,
            inventoryName,
            inventoryClass,
            inventoryNumber,
            inventoryPrice
        }
        updateInventory(queryData)
        .then(response => {
            if (response.code === '200') {
                message.success("库存物料更新成功！");
                setIsUpdateInventoryModalVisible(false);
                const values = {
                    inventoryClass: null,
                };
                handleSearchFish(values);
                selectedInventory(null);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    return (
        <>
           <Breadcrumb style={{ margin: '16px 0' }} items={breadItem}>
            </Breadcrumb>
            <Content style={{ 
                padding: 24, 
                margin: 0, 
                minHeight: 280, 
                background: colorBgContainer, 
                borderRadius: borderRadiusLG,
                }}
            >
                <Form layout="inline" onFinish={handleSearchFish}>
                    <Form.Item label="物料分类" name="inventoryClass" rules={[{ required: false, message: "请输入物料分类！"}]}>
                        <Select 
                            placeholder="请选择物料分类"
                            options={inventoryClassList}
                            style={{width:240}}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="search">
                            搜索
                        </Button>
                    </Form.Item>
                </Form>
                <br></br>
                <Table dataSource={dataSource} columns={columns} pagination={pagination} onChange={handleTableChange}></Table>
            </Content>
            <Modal
                title="库存物料管理"
                open={isUpdateInventoryModalVisible}
                onCancel={() => {setIsUpdateInventoryModalVisible(false); setSelectedInventory(null)}}
                footer={null}
            >
                <Form initialValues={{ inventoryClass: selectedInventory != null ? Number(selectedInventory.inventoryClass) : 0,
                    inventoryName: selectedInventory != null ? selectedInventory.inventoryName : "",
                    inventoryNumber: selectedInventory != null ? selectedInventory.inventoryNumber : "",
                    inventoryPrice: selectedInventory != null ? selectedInventory.inventoryPrice : ""}}
                    onFinish={handleUpdateInventory}>
                    <Form.Item label="物料名称" name="inventoryName" rules={[{ required: true, message: "请输入物料名称！"}]}>
                        <Input disabled/>
                    </Form.Item>
                    <Form.Item label="物料分类" name="inventoryClass" rules={[{ required: true, message: "请输入物料分类！"}]}>
                        <Select 
                            options={inventoryClassList}
                            disabled
                        />
                    </Form.Item>
                    <Form.Item label="物料数量" name="inventoryNumber" rules={[{ required: true, message: "请输入物料数量！"}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item label="物料单价" name="inventoryPrice" rules={[{ required: true, message: "请输入物料单价！"}]}>
                        <Input />
                    </Form.Item>
                    <Form.Item style={{textAlign:'center'}}>
                            <Button type='primary' htmlType="submit" size='large' className='createBtn'>更新物料信息</Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default InventoryList;
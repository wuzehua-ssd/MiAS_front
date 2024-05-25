import { Breadcrumb, Form, Layout, theme, Select, Button, Tag, Space, Table, Modal, message, Input } from "antd";
import { useState, useEffect } from "react";
import { orderAccept, orderList, orderMaintenance } from "../../api/Order";
import './EngineerOrderList.css';

const { Content } = Layout;

const orderStateList = [
    {
        value: 0,
        label: '用户已取消',
    },
    {
        value: 1,
        label: '用户已创建',
    },
    {
        value: 2,
        label: '用户已确认',
    },
    {
        value: 3,
        label: '工程师已接单',
    },
    {
        value: 4,
        label: '设备维修中',
    },
    {
        value: 5,
        label: '人工复检中',
    },
    {
        value: 6,
        label: '费用待支付',
    },
    {
        value: 7,
        label: '返还待确认',
    },
    {
        value: 8,
        label: '业务完成',
    }
];

const breadItem = [
    {
        title: '工单处理',
    },
    {
        title: '工单列表',
    },
];

const isFaultyList = [
    {
        value: 0,
        label: '设备正常',
    },
    {
        value: 1,
        label: '存在故障',
    },
]

function EngineerOrderList() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [dataSource, setDataSource] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [isAcceptModalVisible, setIsAcceptModalVisible] = useState(false);
    const [isMaintenanceModalVisible, setIsMaintenanceModalVisible] = useState(false);

    const columns = [
        {
            title: "工单号",
            dataIndex: "id",
            key: "id",
        },
        {
            title: "姓名",
            dataIndex: "userName",
            key: "userName",
        },
        {
            title: "电话",
            dataIndex: "userPhone",
            key: "userPhone",
        },
        {
            title: "地址",
            dataIndex: "userAddress",
            key: "userAddress",
        },
        {
            title: "商品信息",
            dataIndex: "productInfo",
            key: "productInfo",
        },
        {
            title: "SN信息",
            dataIndex: "snInfo",
            key: "snInfo",
        },
        {
            title: "工单状态",
            dataIndex: "status",
            key: "status",
            render: (status) => {
                const state = orderStateList.find(item => item.value === status);
                if (state) {
                    if (state.value === 0) {
                        return <Tag color="red">{state.label}</Tag>;
                    } else if (state.value === 8) {
                        return <Tag color="green">{state.label}</Tag>;
                    } else{
                        return <Tag color="blue">{state.label}</Tag>;
                    }
                }
                return null;
            },
        },
        {
            title: "用户故障描述",
            dataIndex: "userDesc",
            key: "userDesc",
        },
        {
            title: "发票号",
            dataIndex: "invoiceInfo",
            key: "invoiceInfo",
        },
        {
            title: "故障检测结果",
            dataIndex: "engineerDesc",
            key: "engineerDesc",
        },
        {
            title: "操作",
            key: "action",
            fixed: "right",
            render: (_, record) => {
                if (record.status === 0) {
                    return (
                        <text style={{color:"red"}}>该工单已被用户取消！</text>
                    );
                }
                if (record.status === 1) {
                    return (
                        <text style={{color:"red"}}>该工单待用户确认！</text>
                    );
                }
                if (record.status === 2) {
                    const handleShowAccept = () => {
                        setSelectedOrder(record);
                        setIsAcceptModalVisible(true);
                    };
                    return (
                        <Space>
                            <a onClick={(e) => {e.stopPropagation(); handleShowAccept()}}>认领工单</a>
                        </Space>
                    );
                }
                if (record.status === 3) {
                    const handleShowMaintenance = () => {
                        setSelectedOrder(record);
                        setIsMaintenanceModalVisible(true);
                    };
                    return (
                        <Space>
                            <a onClick={(e) => {e.stopPropagation(); handleShowMaintenance()}}>人工检修</a>
                        </Space>
                    );
                }
                if (record.status === 4) {
                    return (
                        <Space>
                            <a onClick={(e) => {e.stopPropagation();}}>物料申请</a>
                            <a onClick={(e) => {e.stopPropagation();}}>人工复检</a>
                        </Space>
                    );
                }
            },
        },
    ];

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
                const response = await orderList(queryData); // 替换为实际的后端接口调用
    
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
        const { orderState } = values;
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        const userId = user.id;
        const queryData = {
            pageNum,
            pageSize,
            userId,
            status: orderState,
        }
        orderList(queryData)
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

    const handleOrderAccept = () => {
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        const engineerId = user.id;
        const queryData = {
            orderId: selectedOrder.id,
            engineerId
        }
        orderAccept(queryData)
        .then(response => {
            if (response.code === '200') {
                message.success("工单认领成功！");
                setIsAcceptModalVisible(false);
                const values = {
                    orderState: null,
                };
                handleSearchFish(values);
                setSelectedOrder(null);
            } else {
                message.error(response.msg);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    const handleOrderMaintenance = (values) => {
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        const engineerId = user.id;
        const { isFaulty, engineerDesc} = values;
        const queryData = {
            orderId: selectedOrder.id,
            engineerId,
            isFaulty,
            engineerDesc,
        }
        orderMaintenance(queryData)
        .then(response => {
            if (response.code === '200') {
                message.success("故障检测结果上传成功！");
                setIsMaintenanceModalVisible(false);
                const values = {
                    orderState: null,
                };
                handleSearchFish(values);
                setSelectedOrder(null);
            } else {
                message.error(response.msg);
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
                    <Form.Item label="工单状态" name='orderState' rules={[{ required: false, message: "请选择工单状态！"}]}>
                        <Select 
                            placeholder="请选择工单状态"
                            options={orderStateList}
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
                <Table dataSource={dataSource} columns={columns} pagination={pagination} onChange={handleTableChange}  scroll={{ x: 'max-content' }}></Table>
            </Content>
            <Modal
                title="认领工单"
                open={isAcceptModalVisible}
                onCancel={() => {setIsAcceptModalVisible(false); setSelectedOrder(null)}}
                footer={null}
            >
                <p>是否确定认领工单号为: {selectedOrder===null ? -1 : selectedOrder.id} 的工单？</p>
                <Button type="primary" style={{ backgroundColor: 'green' }} className="btn-spacing" onClick={handleOrderAccept}>
                    是
                </Button>
                <Button type="primary" className="btn-spacing" onClick={() => {setIsAcceptModalVisible(false); setSelectedOrder(null)}}>
                    否
                </Button>
            </Modal>
            <Modal
                title="人工检修"
                open={isMaintenanceModalVisible}
                onCancel={() => {setIsMaintenanceModalVisible(false); setSelectedOrder(null)}}
                footer={null}
            >
                <Form onFinish={handleOrderMaintenance}>
                    <Form.Item label="是否存在故障" name='isFaulty' rules={[{ required: true, message: "请选择是否存在故障！"}]}>
                        <Select 
                            placeholder="请选择是否存在故障"
                            options={isFaultyList}
                            allowClear
                        />
                    </Form.Item>
                    <Form.Item label="请输入故障检测结果" name='engineerDesc' rules={[{ required: true, message: "请输入故障检测结果！"}]}>
                        <Input placeholder='请输入故障检测结果' />
                    </Form.Item>
                    <Form.Item style={{ textAlign: "center" }}>
                        <Button type="primary" htmlType="submit">
                            提交故障检测结果
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
        </>
    )
}

export default EngineerOrderList;
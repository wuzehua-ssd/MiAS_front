import { Breadcrumb, Form, Layout, theme, Select, Button, Tag, Space, Table, Modal, message, Input, Upload } from "antd";
import { useState, useEffect } from "react";
import { UploadOutlined } from '@ant-design/icons';
import { orderAccept, orderList, orderMaintenance, orderRecheck, orderToRecheck } from "../../api/Order";
import './EngineerOrderList.css';
import { inventoryList } from "../../api/Inventory";

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
    const [isInventoryModalVisible, setIsInventoryModalVisible] = useState(false);
    const [dataSourceInventory, setDataSourceInventory] = useState([]);
    const [selectedInventory, setSelectedInventory] = useState(null);
    const [isInventory, setIsInventory] = useState(false);
    const [isRecheckModalVisible, setIsRecheckModalVisible] = useState(false);
    const [videoUrl, setVideoUrl] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [fileSelected, setFileSelected] = useState(false);

    const columns = [
        {
            title: "工单号",
            dataIndex: "id",
            key: "id",
            width: 80
        },
        {
            title: "姓名",
            dataIndex: "userName",
            key: "userName",
            width: 80
        },
        {
            title: "电话",
            dataIndex: "userPhone",
            key: "userPhone",
            width: 100
        },
        {
            title: "地址",
            dataIndex: "userAddress",
            key: "userAddress",
            width: 80
        },
        {
            title: "商品信息",
            dataIndex: "productInfo",
            key: "productInfo",
            width: 250
        },
        {
            title: "SN信息",
            dataIndex: "snInfo",
            key: "snInfo",
            width: 80
        },
        {
            title: "工单状态",
            dataIndex: "status",
            key: "status",
            width: 100,
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
            width: 250
        },
        {
            title: "发票号",
            dataIndex: "invoiceInfo",
            key: "invoiceInfo",
            width: 100
        },
        {
            title: "故障检测结果",
            dataIndex: "engineerDesc",
            key: "engineerDesc",
            width: 300
        },
        {
            title: "操作",
            key: "action",
            fixed: "right",
            width: 200,
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
                    const handleShowInventory = () => {
                        setSelectedOrder(record);
                        const values = {
                            inventoryClass: null,
                        };
                        handleSearchInventoryFish(values);
                        setIsInventoryModalVisible(true);
                    };
                    return (
                        <Space>
                            <a onClick={(e) => {e.stopPropagation(); handleShowInventory()}}>物料申请</a>
                        </Space>
                    );
                }
                if (record.status === 5) {
                    const handleShowRecheck = () => {
                        setSelectedOrder(record);
                        setIsRecheckModalVisible(true);
                    };
                    return (
                        <Space>
                            <a onClick={(e) => {e.stopPropagation(); handleShowRecheck()}}>上传复检视频</a>
                        </Space>
                    );
                }
                if (record.status === 6) {
                    return (
                        <Space>
                            <a onClick={(e) => {e.stopPropagation();}}>查看支付情况</a>
                            <a onClick={(e) => {e.stopPropagation();}}>返还设备</a>
                        </Space>
                    );
                }
                if (record.status === 7) {
                    return (
                        <text style={{color:"red"}}>待用户确认收到设备！</text>
                    );
                }
                if (record.status === 8) {
                    return (
                        <text style={{color:"green"}}>业务已完成！</text>
                    );
                }
            },
        },
    ];

    const columnsInventory = [
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
            fixed: "right",
            render: (_, record) => {
                const handleInventoryApplication = () => {
                    // console.log("申请物料成功！");
                    setSelectedInventory(record);
                    setIsInventory(true);
                };
                return (
                    <Space>
                        <a onClick={(e) => {e.stopPropagation(); handleInventoryApplication()}}>申请该物料</a>
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

    const [paginationInventory, setPaginationInventory] = useState({
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

    const handleTableChangeInventory = (paginationInventory, filters, sorter) => {
        setPaginationInventory((prevPagination) => ({
            ...prevPagination,
            ...paginationInventory,
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
                const total = data.length === 0 ? 0 : data[0].totalNum;
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
            const total = data.length === 0 ? 0 : data[0].totalNum;
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

    const handleSearchInventoryFish = (values) => {
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
            setDataSourceInventory(data);
            const total = data.length === 0  ? 0 : data[0].totalNum;
            setPaginationInventory(prevPagination => ({
                ...prevPagination,
                total,
            }));
        })
        .catch(error => {
            console.log(error);
        });
    }

    const handleToRecheck = () => {
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        const engineerId = user.id;
        const id = selectedInventory === null ? null : selectedInventory.id;
        const queryData = {
            orderId: selectedOrder.id,
            engineerId,
            isInventory,
            id
        }
        orderToRecheck(queryData)
        .then(response => {
            if (response.code === '200') {
                message.success("请求成功！");
                const values = {
                    orderState: null,
                };
                handleSearchFish(values);
                setSelectedOrder(null);
                setIsInventoryModalVisible(false);
            } else {
                message.error(response.msg);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    const handleUpload = (file) => {
        if (file.type === 'video/mp4' & !fileSelected) {
            setFileSelected(true);
            const current = file.originFileObj;
            const fileReader = new FileReader();
            fileReader.readAsDataURL(current);
            fileReader.onload = function (e) {
              setVideoUrl(e.target?.result);
            };
            const newFileList = [...fileList];
            newFileList.push(file);
            setFileList(newFileList);
        }
    };

    const handleRemove = (file) => {
        setFileSelected(false);
        setVideoUrl(null);
        setFileList([]);
    }
    
    const beforeUpload = (file) => {
        const isVideo = file.type.startsWith('video/');
        if (!isVideo) {
          message.error('只能上传视频文件！');
        }
        return isVideo;
    };

    const handleVideoUpload = () => {
        if (fileList.length != 1) {
            // 文件数量不足
            message.error("只允许上传一个自检视频!");
            return;
        }

        let isFileSizeValid = true;
        fileList.forEach(file => {
            if (file.size > 10 * 1024 * 1024) {
              // 文件大小超过10MB
              message.error(`视频 ${file.name} 大小超过10MB!`);
              isFileSizeValid = false;
            }
        });
        
        if (!isFileSizeValid) {
            return;
        }
        const formData = new FormData();
        fileList.forEach(file => {
           // console.log(file);
           formData.append("files", file.originFileObj);
        });
        formData.append("orderId", selectedOrder.id);
        orderRecheck(formData)
        .then(response => {
            message.success(response.msg);
            setIsRecheckModalVisible(false);
            const values = {
                orderState: null,
            };
            handleSearchFish(values);
        })
        .catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        const runOrderToCheck = async () => {
            if (selectedInventory && isInventory) {
                await handleToRecheck();
                setSelectedInventory(null);
                setIsInventory(false);;
            }
        };
        runOrderToCheck();
    }, [selectedInventory, isInventory])

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
                <Table dataSource={dataSource} columns={columns} pagination={pagination} onChange={handleTableChange}  scroll={{ x: 'max-content' , y: '50vh'}}></Table>
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
            <Modal
                title="物料申请"
                open={isInventoryModalVisible}
                onCancel={() => {setIsInventoryModalVisible(false); setSelectedOrder(null)}}
                footer={null}
            >
                <Form layout="inline" onFinish={handleSearchInventoryFish}>
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
                    <br></br>
                    <Table dataSource={dataSourceInventory} columns={columnsInventory} pagination={paginationInventory} onChange={handleTableChangeInventory} scroll={{x:"max-content"}}></Table>
                    <Form.Item style={{textAlign:'center'}}>
                        <Button type='primary' className='createBtn' style={{ backgroundColor: 'red' }} onClick={handleToRecheck}>无需物料，进入人工复检</Button>
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                title="人工复检"
                open={isRecheckModalVisible}
                onCancel={() => {setIsRecheckModalVisible(false); setSelectedOrder(null);setVideoUrl(null);setFileList([])}}
                footer={null}
            >
                <p>请上传一个设备运行正常的视频！</p>
                <Upload
                    beforeUpload={beforeUpload}
                    onChange={({ file }) => handleUpload(file)}
                    onRemove={({ file }) => handleRemove(file)}
                    showUploadList={true}
                >
                    <Button icon={<UploadOutlined />}>选择视频</Button>
                </Upload>
                <br></br>
                {videoUrl && (
                    <video controls style={{ marginTop: '10px', maxWidth: '100%' }}>
                    <source src={videoUrl} type="video/mp4" />
                    </video>
                )}
                <br></br>
                <Button type="primary" style={{ backgroundColor: 'green' }} className="btn-spacing" onClick={handleVideoUpload}>
                    确认上传
                </Button>
                <Button type="primary" className="btn-spacing" onClick={() => {setIsRecheckModalVisible(false);setSelectedOrder(null);setVideoUrl(null);setFileList([])}}>
                    取消上传
                </Button>
            </Modal>
        </>
    )
}

export default EngineerOrderList;
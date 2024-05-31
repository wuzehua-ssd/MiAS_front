import { Breadcrumb, theme, Layout, Form, Select, Button, Table, Space, Modal, Tag, message, Upload, Image, QRCode } from "antd";
import { useState, useEffect } from "react";
import { orderCancel, orderList, orderConfirm, orderDetails, orderConfirmReceipt } from "../../api/Order";
import './UserOrderList.css'
import { PlusOutlined } from '@ant-design/icons';
import { payCreate, payReset, paySearch } from "../../api/pay";

const { Content } = Layout;

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

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
        label: '费用支付中',
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
        title: '服务进度',
    },
    {
        title: '工单列表',
    },
];

function UserOrderList(props) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const [dataSource, setDataSource] = useState([]);
    const [pageNum, setPageNum] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
    const [isConfirmModalVisible, setIsConfirmModalVisible] = useState(false);
    const [isCancelModalVisible, setIsCancelModalVisible] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [fileList, setFileList] = useState([]);
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    // 保存后端返回的文件列表
    const [imageFileList, setImageFileList] = useState([]);
    const [engineerName, setEngineerName] = useState(null);
    const [engineerDesc, setEngineerDesc] = useState(null);
    const [predCost, setPredCost] = useState(null);
    const [videoFile, setVideoFile] = useState(null);
    const [realCost, setRealCost] = useState(null);
    const [isWXPayModalVisible, setIsWXPayModalVisible] = useState(false);
    const [isALiPayModalVisible, setIsALiPayModalVisible] = useState(false);
    const [isPayRecordModalVisible, setIsPayRecordModalVisible] = useState(false);
    const [isConfirmReceiptModalVisible, setIsConfirmReceiptModalVisible] = useState(false);

    const [shouldCallShowProcessDetails, setShouldCallShowProcessDetails] = useState(false);
    const [shouldCallWXPay, setShouldCallWXPay] = useState(false);
    const [shouldCallALiPay, setShouldCallALiPay] = useState(false);
    const [codeUrl, setCodeUrl] = useState(null);
    const [aLiPayBody, setALiPayBody] = useState('');

    const columns = [
        {
            title: "工单号",
            dataIndex: "id",
            key: "id",
            width: 80,
        },
        {
            title: "姓名",
            dataIndex: "userName",
            key: "userName",
            width: 80,
        },
        {
            title: "电话",
            dataIndex: "userPhone",
            key: "userPhone",
            width: 100,
        },
        {
            title: "地址",
            dataIndex: "userAddress",
            key: "userAddress",
            width: 80,
        },
        {
            title: "商品信息",
            dataIndex: "productInfo",
            key: "productInfo",
            width: 250,
        },
        {
            title: "SN信息",
            dataIndex: "snInfo",
            key: "snInfo",
            width: 100,
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
            width: 200,
        },
        {
            title: "发票号",
            dataIndex: "invoiceInfo",
            key: "invoiceInfo",
            width: 100,
        },
        {
            title: "操作",
            key: "action",
            fixed: "right",
            width: 270,
            render: (_, record) => {
                const handleShowProgress = () => {
                    setSelectedOrder(record);
                    setShouldCallShowProcessDetails(true);
                    // setIsDetailModalVisible(true);  
                };
                const handleShowConfirm = () => {
                    setSelectedOrder(record);
                    setIsConfirmModalVisible(true);
                };
                const handleShowCancel = () => {
                    setSelectedOrder(record);
                    setIsCancelModalVisible(true);
                };
                const handleShowWXPay = async () => {
                    setSelectedOrder(record);
                    setShouldCallWXPay(true);
                }
                const handleShowALiPay = () => {
                    setSelectedOrder(record);
                    setShouldCallALiPay(true);
                }
                const handleShowPayRecord = () => {
                    setSelectedOrder(record);
                    setIsPayRecordModalVisible(true);
                }
                if (record.status === 0) {
                    return (
                        <text style={{color:"red"}}>该工单已被用户取消！</text>
                    );
                }
                if (record.status === 1) {
                    return (
                        <Space>
                            <a onClick={(e) => {e.stopPropagation(); handleShowProgress()}}>进度查询</a>
                            <a onClick={(e) => {e.stopPropagation(); handleShowConfirm()}}>确认工单</a>
                            <a onClick={(e) => {e.stopPropagation(); handleShowCancel()}}>取消工单</a>
                        </Space>
                    );
                }
                if (record.status === 2) {
                    return (
                        <Space>
                            <a onClick={(e) => {e.stopPropagation(); handleShowProgress()}}>进度查询</a>
                            <a onClick={(e) => {e.stopPropagation(); handleShowCancel()}}>取消工单</a>
                        </Space>
                    );
                }
                if (record.status === 3 || record.status === 4 || record.status === 5) {
                    return (
                        <Space>
                            <a onClick={(e) => {e.stopPropagation(); handleShowProgress()}}>进度查询</a>
                        </Space>
                    );
                }
                if (record.status === 6 && record.payStatus <= 2) {
                    return (
                        <Space>
                            <a onClick={(e) => {e.stopPropagation(); handleShowProgress()}}>进度查询</a>
                            <a onClick={(e) => {e.stopPropagation(); handleShowWXPay()}}>微信支付</a>
                            <a onClick={(e) => {e.stopPropagation(); handleShowALiPay()}}>支付宝支付</a>
                        </Space>
                    );
                }
                if (record.status === 6 && record.payStatus === 3) {
                    return (
                        <Space>
                            <a onClick={(e) => {e.stopPropagation(); handleShowProgress()}}>进度查询</a>
                            <a onClick={(e) => {e.stopPropagation(); handleShowPayRecord()}}>流水查询</a>
                        </Space>
                    );
                }
                if (record.status === 7) {
                    const handleShowConfirmReceipt = () => {
                        setSelectedOrder(record);
                        setIsConfirmReceiptModalVisible(true);
                    };
                    return (
                        <Space>
                            <a onClick={(e) => {e.stopPropagation(); handleShowProgress()}}>进度查询</a>
                            <a onClick={(e) => {e.stopPropagation(); handleShowPayRecord()}}>流水查询</a>
                            <a onClick={(e) => {e.stopPropagation(); handleShowConfirmReceipt()}}>确认设备返还</a>
                        </Space>
                    );
                }
                if (record.status === 8) {
                    return (
                        <Space>
                            <a onClick={(e) => {e.stopPropagation(); handleShowProgress()}}>进度查询</a>
                            <a onClick={(e) => {e.stopPropagation(); handleShowPayRecord()}}>流水查询</a>
                            <text style={{color:"green"}}>业务已完成！</text>
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

    const handleSitchCreate = () => {
        props.sonSwitch();
    }

    const showProcessDetails = () => {
        const queryData = {
            id: selectedOrder.id
        }
        orderDetails(queryData)
        .then(response => {
            if (response.code === '200') {
                setImageFileList(response.data.imageFileList);
                setEngineerName(response.data.engineerName);
                setEngineerDesc(response.data.engineerDesc);
                setPredCost(response.data.predCost);
                setVideoFile(response.data.videoFile);
                setRealCost(response.data.realCost);
                setIsDetailModalVisible(true);
            } else {
                message.error(response.msg);
            } 
        })
        .catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        const runShowProcessDetails = async () => {
            if (selectedOrder && shouldCallShowProcessDetails) {
                await showProcessDetails();
                setShouldCallShowProcessDetails(false);
            }
        };
        runShowProcessDetails();
    }, [selectedOrder, shouldCallShowProcessDetails])

    const uploadButton = (
        <button style={{border: 0, background: 'none'}} type="button">
            <PlusOutlined />
            <div style={{marginTop: 8}}>
                Upload
            </div>
        </button>
    );

    const handlePreview = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true); 
    }

    const handleChange = ({ fileList: newFileList }) => setFileList(newFileList);

    const handlePictureUpload = () => {
        if (fileList.length < 3) {
            // 文件数量不足
            message.error("请至少选择三张图片!");
            return;
        }
        
        let isFileSizeValid = true;
        fileList.forEach(file => {
            if (file.size > 2 * 1024 * 1024) {
              // 文件大小超过2MB
              message.error(`图片 ${file.name} 大小超过2MB!`);
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
        // console.log(formData.get('file'));
        // 调用后端文件上传接口
        orderConfirm(formData)
        .then(response => {
            message.success(response.msg);
            setIsConfirmModalVisible(false);
            const values = {
                orderState: null,
            };
            handleSearchFish(values);
        })
        .catch(error => {
            console.log(error);
        });
    }

    const handleOrderCancel = () => {
        const queryData = {
            id: selectedOrder.id
        }
        orderCancel(queryData)
        .then(response => {
            if (response.code === '200') {
                message.success("工单取消成功！");
                setIsCancelModalVisible(false);
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

    const WXPay = () => {
        let intervalId = null;
        const maxTries = 20;
        let tries = 0;

        const queryData = {
            orderId: selectedOrder ? selectedOrder.id : 0,
            payType: "NATIVE"
        };
        payCreate(queryData)
        .then(response => {
            if (response.code === '200') {
                message.success("支付单创建成功！");
                setCodeUrl(response.data.codeUrl);
                setIsWXPayModalVisible(true);
                const paySearchData = {
                    orderId: selectedOrder ? selectedOrder.id : 0,
                }
                // 开始查询支付状态
                intervalId = setInterval(() => {
                    paySearch(paySearchData)
                    .then(statusResponse => {
                        if (statusResponse.payStatus == 3) {
                            clearInterval(intervalId);
                            message.success("支付成功！");
                            setIsWXPayModalVisible(false);
                            const values = {
                                orderState: null,
                            };
                            handleSearchFish(values);
                            setSelectedOrder(null);

                        } else if (tries >= maxTries) {
                            clearInterval(intervalId);
                            message.error("支付失败或超时！");
                            payReset(paySearchData)
                            .then(response => {
                                console.log(response);
                                if (response.payStatus === 1) {
                                    message.success("重置工单支付状态成功，请重新点击费用支付按钮！")
                                } else {
                                     message.error(response.msg);
                                }
                            })
                            .catch(error => {
                                message.error("重置工单支付状态出错！");
                                clearInterval(intervalId);
                            });
                            setIsWXPayModalVisible(false);
                        } else {
                            tries++;
                        }
                    })
                    .catch(error => {
                        message.error("查询支付状态出错！");
                        clearInterval(intervalId);
                    });
                }, 3000);
            } else {
                message.error(response.msg);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        const runWXPay = async () => {
            if (selectedOrder && shouldCallWXPay) {
                WXPay();
                setShouldCallWXPay(false);
            }
        };
        runWXPay();
    }, [selectedOrder, shouldCallWXPay])

    const ALiPay = () => {
        let intervalId = null;
        const maxTries = 20;
        let tries = 0;

        const queryData = {
            orderId: selectedOrder ? selectedOrder.id : 0,
            payType: "alipay_pc"
        };
        payCreate(queryData)
        .then(response => {
            if (response.code === '200') {
                message.success("支付单创建成功！");
                setALiPayBody(response.data.body);
                setIsALiPayModalVisible(true);
                const paySearchData = {
                    orderId: selectedOrder ? selectedOrder.id : 0,
                }
                // 开始查询支付状态
                intervalId = setInterval(() => {
                    paySearch(paySearchData)
                    .then(statusResponse => {
                        if (statusResponse.payStatus == 3) {
                            clearInterval(intervalId);
                            message.success("支付成功！");
                            setIsALiPayModalVisible(false);
                            const values = {
                                orderState: null,
                            };
                            handleSearchFish(values);
                            setSelectedOrder(null);
                        } else if (tries >= maxTries) {
                            clearInterval(intervalId);
                            message.error("支付失败或超时！");
                            payReset(paySearchData)
                            .then(response => {
                                console.log(response);
                                if (response.payStatus === 1) {
                                    message.success("重置工单支付状态成功，请重新点击费用支付按钮！")
                                } else {
                                     message.error(response.msg);
                                }
                            })
                            .catch(error => {
                                message.error("重置工单支付状态出错！");
                                clearInterval(intervalId);
                            });
                            setIsALiPayModalVisible(false);
                        } else {
                            tries++;
                        }
                    })
                    .catch(error => {
                        message.error("查询支付状态出错！");
                        clearInterval(intervalId);
                    });
                }, 3000);
            } else {
                message.error(response.msg);
            }
        })
        .catch(error => {
            console.log(error);
        });
    }

    useEffect(() => {
        const runALiPay = async () => {
            if (selectedOrder && shouldCallALiPay) {
                ALiPay();
                setShouldCallALiPay(false);
            }
        };
        runALiPay();
    }, [selectedOrder, shouldCallALiPay])

    const handleConfirmReceipt = () => {
        const queryData = {
            id: selectedOrder.id
        }
        orderConfirmReceipt(queryData)
        .then(response => {
            if (response.code === '200') {
                message.success("确认设备返还成功！");
                setIsConfirmReceiptModalVisible(false);
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
                    <Form.Item>
                        <Button type="primary" htmlType="create" onClick={handleSitchCreate}>
                            创建
                        </Button>
                    </Form.Item>
                </Form>
                <br></br>
                <Table dataSource={dataSource} columns={columns} pagination={pagination} onChange={handleTableChange} scroll={{x: 'max-content', y: '50vh'}}></Table>
            </Content>
            <Modal
                title="工单进度查询"
                open={isDetailModalVisible}
                onCancel={() => {setIsDetailModalVisible(false); setSelectedOrder(null)}}
                footer={null}
            >
                { (selectedOrder === null ? 0 : selectedOrder.status) >= 1 && (
                    <div>
                        <h4>1、用户工单创建：已完成！</h4>
                        <div className="user-details">
                            <h5>用户信息：</h5>
                            <p>姓名：{selectedOrder.userName}，电话：{selectedOrder.userPhone}，地址：{selectedOrder.userAddress}</p>
                        </div>
                        <div className="order-details">
                            <h5>订单信息：</h5>
                            <p>商品信息：{selectedOrder.productInfo}，SN信息：{selectedOrder.snInfo}，发票信息：{selectedOrder.invoiceInfo}</p>
                        </div>
                        <div className="user-descs">
                            <h5>故障描述：</h5>
                            <p>{selectedOrder.userDesc}</p>
                        </div>
                    </div>
                )}
                { (selectedOrder === null ? 0 : selectedOrder.status) >= 2 && (
                    <div>
                        <h4>2、用户工单确认：已完成！</h4>
                        <div className="user-pics">
                            <h5>故障照片：</h5>
                            <div className="image-grid">
                                {imageFileList.map((imageData, index) => 
                                    <div className="image-preview-container" key={index}>
                                        <div className="image-wrapper">
                                         <img 
                                          src={`data:image/png;base64,${imageData}`} 
                                          alt={`image ${index}`} 
                                          className="fault-image"
                                         />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                { (selectedOrder === null ? 0 : selectedOrder.status) >= 3 && (
                    <div>
                        <h4>3、工程师认领工单：已完成！</h4>
                        <p>该工单已分配给工程师：{engineerName}。</p>
                    </div>
                )}
                { (selectedOrder === null ? 0 : selectedOrder.status) >= 4 && (
                    <div>
                        <h4>4、工程师人工检测：已完成！</h4>
                        <p>故障检测结果：{engineerDesc}。</p>
                    </div>
                )}
                { (selectedOrder === null ? 0 : selectedOrder.status) >= 5 && (
                    <div>
                        <h4>5、工程师设备维修：已完成！</h4>
                        <p>预估维修费用：{predCost}元RMB。</p>
                    </div>
                )}
                { (selectedOrder === null ? 0 : selectedOrder.status) >= 6 && (
                    <div>
                        <h4>6、工程师人工自检：已完成！</h4>
                        <p>自检视频：</p>
                        <div className="video-container">
                            {videoFile && (
                                <video controls className="video-player">
                                <source src={`data:video/mp4;base64,${videoFile}`} type="video/mp4" />
                                </video>
                            )}
                        </div>
                    </div>
                )}
                { (selectedOrder === null ? 0 : selectedOrder.status) >= 7 && (
                    <div>
                        <h4>7、用户支付：已完成！</h4>
                        <p>实际支付费用：{realCost}元RMB。</p>
                    </div>
                )}
                { (selectedOrder === null ? 0 : selectedOrder.status) >= 8 && (
                    <div>
                        <h4>8、工单已完成！</h4>
                    </div>
                )}
            </Modal>
            <Modal
                title="工单确认"
                open={isConfirmModalVisible}
                onCancel={() => {setIsConfirmModalVisible(false);setSelectedOrder(null)}}
                footer={null}
            >
                <p>请上传3到9张设备问题照片！</p>
                <Upload
                listType="picture-card"
                fileList={fileList}
                onPreview={handlePreview}
                onChange={handleChange}
                >
                    {fileList.length >= 9 ? null : uploadButton}
                </Upload>
                {previewImage && (
                    <Image 
                     wrapperStyle={{display: 'none'}}
                     preview={{visible: previewOpen, 
                        onVisibleChange: (visible) => setPreviewOpen(visible), 
                        afterOpenChange: (visible) => !visible && setPreviewImage(''),}}
                     src={previewImage} />
                )}
                <br></br>
                <Button type="primary" style={{ backgroundColor: 'green' }} className="btn-spacing" onClick={handlePictureUpload}>
                    确认上传
                </Button>
                <Button type="primary" className="btn-spacing" onClick={() => {setIsConfirmModalVisible(false);setSelectedOrder(null)}}>
                    取消上传
                </Button>
            </Modal>
            <Modal
                title="工单取消"
                open={isCancelModalVisible}
                onCancel={() => {setIsCancelModalVisible(false); setSelectedOrder(null)}}
                footer={null}
            >
                <p>是否确定取消工单号为: {selectedOrder===null ? -1 : selectedOrder.id} 的工单？</p>
                <Button type="primary" style={{ backgroundColor: 'red' }} className="btn-spacing" onClick={handleOrderCancel}>
                    是
                </Button>
                <Button type="primary" className="btn-spacing" onClick={() => {setIsCancelModalVisible(false); setSelectedOrder(null)}}>
                    否
                </Button>
            </Modal>
            <Modal
                title="微信支付"
                open={isWXPayModalVisible}
                onCancel={() => {
                    const paySearchData = {
                        orderId: selectedOrder ? selectedOrder.id : 0,
                    }
                    payReset(paySearchData)
                    .then(response => {
                        console.log(response);
                        if (response.payStatus === 1) {
                            message.success("重置工单支付状态成功，请重新点击费用支付按钮！")
                        } else {
                            message.error(response.msg);
                        }
                    })
                    .catch(error => {
                        message.error("重置工单支付状态出错！");
                    });
                    setIsWXPayModalVisible(false); 
                    setSelectedOrder(null);
                }}
                footer={null}
            >
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                    <QRCode value={codeUrl || '-'} />
                </div>
            </Modal>
            <Modal
                title="支付宝支付"
                open={isALiPayModalVisible}
                onCancel={() => {
                    const paySearchData = {
                        orderId: selectedOrder ? selectedOrder.id : 0,
                    }
                    payReset(paySearchData)
                    .then(response => {
                        console.log(response);
                        if (response.payStatus === 1) {
                            message.success("重置工单支付状态成功，请重新点击费用支付按钮！")
                        } else {
                            message.error(response.msg);
                        }
                    })
                    .catch(error => {
                        message.error("重置工单支付状态出错！");
                    });
                    setIsALiPayModalVisible(false); 
                    setSelectedOrder(null);
                }}
                footer={null}
                width={1080}
                height={1080}
                style={{
                    top: 15,
                  }}
            >
                <iframe width="1000" height="880" srcDoc={aLiPayBody} title="ALiPay"></iframe>
            </Modal>
            <Modal
                title="支付流水记录"
                open={isPayRecordModalVisible}
                onCancel={() => {setIsPayRecordModalVisible(false); setSelectedOrder(null)}}
                footer={null}
            >
                { selectedOrder != null && (
                    <div>
                        <div className="user-details">
                            <h5>用户信息：</h5>
                            <p>姓名：{selectedOrder.userName}，电话：{selectedOrder.userPhone}，地址：{selectedOrder.userAddress}</p>
                        </div>
                        <div className="order-details">
                            <h5>订单信息：</h5>
                            <p>商品信息：{selectedOrder.productInfo}，SN信息：{selectedOrder.snInfo}，发票信息：{selectedOrder.invoiceInfo}</p>
                        </div>
                        <div className="user-descs">
                            <h5>支付流水：</h5>
                            <p>用户实际支付费用为：{selectedOrder.realCost}元人民币。</p>
                        </div>
                    </div>
                )}
            </Modal>
            <Modal
                title="确认设备返还"
                open={isConfirmReceiptModalVisible}
                onCancel={() => {setIsConfirmReceiptModalVisible(false); setSelectedOrder(null)}}
                footer={null}
            >
                <p>是否确定收到工单号为: {selectedOrder===null ? -1 : selectedOrder.id} 的工单中的设备：{selectedOrder===null ? "" : selectedOrder.productInfo},您已经收到！</p>
                <Button type="primary" style={{ backgroundColor: 'red' }} className="btn-spacing" onClick={handleConfirmReceipt}>
                    是
                </Button>
                <Button type="primary" className="btn-spacing" onClick={() => {setIsConfirmReceiptModalVisible(false); setSelectedOrder(null)}}>
                    否
                </Button>
            </Modal>
        </>
    )
}

export default UserOrderList;
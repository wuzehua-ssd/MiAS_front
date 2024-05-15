import { Breadcrumb, theme, Layout, Form, Select, Button, Table, Space, Modal } from "antd";
import { useState } from "react";

const { Content } = Layout;

const orderStateList = [
    {
        value: '0',
        label: '用户已创建',
    },
    {
        value: '1',
        label: '用户已确认',
    },
    {
        value: '2',
        label: '工程师已接单',
    },
    {
        value: '3',
        label: '设备维修中',
    },
    {
        value: '4',
        label: '物料申请中',
    },
    {
        value: '5',
        label: '人工复检中',
    },
    {
        value: '6',
        label: '费用待支付',
    },
    {
        value: '7',
        label: '设备已返还，工单完成',
    },
];

const breadItem = [
    {
        title: '服务进度',
    },
    {
        title: '工单列表',
    },
];

const dataSource = [
    {
        orderId: "1",
        realName: "小吴",
        phone: "13871723995",
        address: "WHU",
        productInfo: "小米14",
        SNInfo: "XXX",
        productClass: "手机",
        orderState: "已创建",
        errorByUser: "屏幕异色",
    },
    {
        orderId: "2",
        realName: "小吴",
        phone: "13871723995",
        address: "WHU",
        productInfo: "小米14",
        SNInfo: "XXX",
        productClass: "手机",
        orderState: "费用待支付",
        errorByUser: "屏幕异色",
    },
];

function UserOrderList(props) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleSearchFish = (values) => {
        console.log(values);
    }

    const handleSitchCreate = () => {
        props.sonSwitch();
    }

    const [isModalVisible, setIsModalVisible] = useState(false);

    const columns = [
        {
            title: "工单号",
            dataIndex: "orderId",
            key: "orderId",
        },
        {
            title: "姓名",
            dataIndex: "realName",
            key: "realName",
        },
        {
            title: "电话",
            dataIndex: "phone",
            key: "phone",
        },
        {
            title: "地址",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "商品信息",
            dataIndex: "productInfo",
            key: "productInfo",
        },
        {
            title: "SN信息",
            dataIndex: "SNInfo",
            key: "SNInfo",
        },
        {
            title: "商品分类",
            dataIndex: "productClass",
            key: "productClass",
        },
        {
            title: "工单状态",
            dataIndex: "orderState",
            key: "orderState",
        },
        {
            title: "用户故障描述",
            dataIndex: "errorByUser",
            key: "errorByUser",
        },
        {
            title: "操作",
            key: "action",
            render: (_, record) => {
                const handleShowProgress = () => {
                    setIsModalVisible(true);
                };
    
                if (record.orderState === "已创建") {
                    return (
                        <Space>
                            <a onClick={handleShowProgress}>工单进度</a>
                            <a>确认工单</a>
                        </Space>
                    );
                } else if (record.orderState === "费用待支付") {
                    return (
                        <Space>
                            <a>工单进度</a>
                            <a>费用支付</a>
                        </Space>
                    );
                } else {
                    return (
                        <Space>
                            <a>工单进度</a>
                        </Space>
                    );
                }
            },
        },
    ];

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
                    <Form.Item label="工单状态" name='orderState' rules={[{ required: true, message: "请选择订单状态！"}]}>
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
                <Table dataSource={dataSource} columns={columns}></Table>
            </Content>
            <Modal
                title="工单进度"
                open={isModalVisible}
                onCancel={() => setIsModalVisible(false)}
                footer={null}
            >
                <p>这里是工单进度的内容</p>
                {/* 可根据需求添加工单进度的具体信息 */}
            </Modal>
        </>
    )
}

export default UserOrderList;
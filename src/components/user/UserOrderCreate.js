import { Breadcrumb, theme, Layout, Form, Input, Button, message } from "antd";
import './UserOrderCreate.css'
import { orderCreate } from "../../api/Order";

const { Content } = Layout;

const breadItem = [
    {
        title: '服务进度',
    },
    {
        title: '工单创建',
    },
];

function UserOrderCreate(props) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleFinish = (values) => {
        const { userName, userPhone, userAddress, snInfo, productInfo, userDesc, invoiceInfo} = values;
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        const userId = user.id;
        const orderData = {
            userId,
            userName,
            userPhone,
            userAddress,
            snInfo,
            productInfo,
            userDesc,
            invoiceInfo
        }

        orderCreate(orderData)
        .then(response => {
            if (response.code === '200') {
                message.success("工单创建成功！");
                props.sonSwitch();
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
                display: 'flex',
                justifyContent: 'center',
                padding: 24, 
                margin: 0, 
                minHeight: 280, 
                background: colorBgContainer, 
                borderRadius: borderRadiusLG,
                }}
            >
                <div className="orderCreateContainer">
                    <h2 className='title'>请输入相关信息创建工单：</h2>
                        <Form onFinish={handleFinish}>
                            <Form.Item label="姓名" name="userName" rules={[{ required: true, message: "请输入收货用户姓名！"}]}>
                                <Input placeholder='请输入收货用户姓名' />
                            </Form.Item>
                            <Form.Item label="电话" name="userPhone" rules={[{ required: true, message: "请输入收货用户电话！"}]}>
                                <Input placeholder='请输入收货用户电话' />
                            </Form.Item>
                            <Form.Item label="地址" name="userAddress" rules={[{ required: true, message: "请输入收货用户地址！"}]}>
                                <Input placeholder='请输入收货用户地址' />
                            </Form.Item>
                            <Form.Item label="SN信息" name="snInfo" rules={[{ required: true, message: "请输入SN信息！"}]}>
                                <Input placeholder='请输入SN信息' />
                            </Form.Item>
                            <Form.Item label="商品信息" name="productInfo" rules={[{ required: true, message: "请输入商品信息！"}]}>
                                <Input placeholder='请输入商品信息' />
                            </Form.Item>
                            <Form.Item label="故障描述" name="userDesc" rules={[{ required: true, message: "请输入故障描述！"}]}>
                                <Input placeholder='请输入故障描述' />
                            </Form.Item>
                            <Form.Item label="发票信息" name="invoiceInfo" rules={[{ required: true, message: "请输入发票信息！"}]}>
                                <Input placeholder='请输入发票信息' />
                            </Form.Item>
                            <Form.Item style={{textAlign:'center'}}>
                                <Button type='primary' htmlType="submit" size='large' className='createBtn'>创建工单</Button>
                            </Form.Item>
                        </Form>
                </div>
            </Content>
        </>
    )
}

export default UserOrderCreate;
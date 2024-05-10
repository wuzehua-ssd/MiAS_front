import { Breadcrumb, theme, Layout } from "antd";

const { Content } = Layout;

function UserOrderCreate() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>服务进度</Breadcrumb.Item>
                <Breadcrumb.Item>工单创建</Breadcrumb.Item>
            </Breadcrumb>
            <Content style={{ 
                padding: 24, 
                margin: 0, 
                minHeight: 280, 
                background: colorBgContainer, 
                borderRadius: borderRadiusLG,
                }}
            >
                工单创建界面
            </Content>
        </>
    )
}

export default UserOrderCreate;
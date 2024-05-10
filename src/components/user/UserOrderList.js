import { Breadcrumb, theme, Layout } from "antd";

const { Content } = Layout;

function UserOrderList() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <>
            <Breadcrumb style={{ margin: '16px 0' }}>
                <Breadcrumb.Item>服务进度</Breadcrumb.Item>
                <Breadcrumb.Item>工单列表</Breadcrumb.Item>
            </Breadcrumb>
            <Content style={{ 
                padding: 24, 
                margin: 0, 
                minHeight: 280, 
                background: colorBgContainer, 
                borderRadius: borderRadiusLG,
                }}
            >
                工单列表界面
            </Content>
        </>
    )
}

export default UserOrderList;
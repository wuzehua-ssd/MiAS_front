import { Breadcrumb, theme, Layout } from "antd";

const { Content } = Layout;

const breadItem = [
    {
        title: '服务进度',
    },
    {
        title: '工单创建',
    },
];

function UserOrderCreate() {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

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
                工单创建界面
            </Content>
        </>
    )
}

export default UserOrderCreate;
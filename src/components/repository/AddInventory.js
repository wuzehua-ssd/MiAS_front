import { Breadcrumb, Layout, theme, Form, Input, Button, Select,message } from "antd";
import './AddInventory.css';
import { addInventory } from "../../api/Inventory";

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
        title: '添加物料',
    },
];


function AddInventory(props) {
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    const handleFinish = (values) => {
        const { inventoryName, inventoryClass, inventoryNumber, inventoryPrice} = values;
        const user = JSON.parse(localStorage.getItem("user") || '{}');
        const userId = user.id;
        const queryData = {
            userId,
            inventoryName,
            inventoryClass,
            inventoryNumber,
            inventoryPrice
        }
        addInventory(queryData)
        .then(response => {
            if (response.code === '200') {
                message.success("新增物料成功！");
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
                <div className="addInventoryContainer">
                    <h2 className='title'>请输入相关信息添加物料：</h2>
                    <Form onFinish={handleFinish}>
                        <Form.Item label="物料名称" name="inventoryName" rules={[{ required: true, message: "请输入物料名称！"}]}>
                            <Input placeholder='请输入物料名称' />
                        </Form.Item>
                        <Form.Item label="物料分类" name="inventoryClass" rules={[{ required: true, message: "请输入物料分类！"}]}>
                            <Select 
                                placeholder="请选择物料分类"
                                options={inventoryClassList}
                                allowClear
                            />
                        </Form.Item>
                        <Form.Item label="物料数量" name="inventoryNumber" rules={[{ required: true, message: "请输入物料数量！"}]}>
                            <Input placeholder='请输入物料数量' />
                        </Form.Item>
                        <Form.Item label="物料单价" name="inventoryPrice" rules={[{ required: true, message: "请输入物料单价！"}]}>
                            <Input placeholder='请输入物料单价' />
                        </Form.Item>
                        <Form.Item style={{textAlign:'center'}}>
                                <Button type='primary' htmlType="submit" size='large' className='createBtn'>添加物料</Button>
                        </Form.Item>
                    </Form>
                </div>
            </Content>
        </>
    )
}

export default AddInventory;
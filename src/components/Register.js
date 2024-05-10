import { Button, Form, Input, message } from 'antd';
import './Register.css';
import { useNavigate } from 'react-router-dom';

function Register(props) {
    const navigate = useNavigate();

    const handleSitchLogin = () => {
        props.sonSwitch();
    }

    const handleFinish = (values) => {
      const { username, password, checkPassword, realName, phone } = values;
      console.log('用户名:', username);
      console.log('密码:', password);
      console.log('姓名:', realName);
      console.log('电话:', phone);

      //调用后端注册接口并返回结果

      //判断返回结果并进入用户页面
      message.success('注册成功！')
      navigate('/user');
    }

    return (
        <div className='container'>
          <h2 className='title'>小米售后维修服务工单履约系统</h2>
          <Form onFinish={handleFinish}>
            <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名！"}]}>
              <Input placeholder='请输入用户名' />
            </Form.Item>
            <Form.Item label="用户密码 " name="password" rules={[{ required: true, message: "请输入密码！"}]}>
              <Input.Password placeholder='请输入密码' />
            </Form.Item>
            <Form.Item label="确认密码 " name="checkPassword" rules={[{ required: true, message: "请确认密码！"}]}>
              <Input.Password placeholder='请确认密码' />
            </Form.Item>
            <Form.Item label="姓名 " name="realName" rules={[{ required: true, message: "请输入姓名！"}]}>
              <Input placeholder='请输入姓名' />
            </Form.Item>
            <Form.Item label="电话 " name="phone" rules={[{ required: true, message: "请输入电话！"}]}>
              <Input placeholder='请输入电话' />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType="submit" size='large' className='btn'>注册</Button>
            </Form.Item>
            <Form.Item>
              <a onClick={handleSitchLogin}>已有账号？点此登录</a>
            </Form.Item>
          </Form>
        </div>
    )
}

export default Register;
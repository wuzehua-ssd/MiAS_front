import { Button, Form, Input, message } from 'antd';
import './Register.css';
import { useNavigate } from 'react-router-dom';
import { userRegister } from '../api/User';

function Register(props) {
    const navigate = useNavigate();

    const handleSitchLogin = () => {
        props.sonSwitch();
    }

    const handleFinish = (values) => {
      const { loginName, password, checkPassword, name, phone, address } = values;

      if (checkPassword !== password) {
        message.error("两次输入密码不一致！");
      } else {
        const registerData = {
          loginName,
          password,
          name,
          phone,
          address
        }
        userRegister(registerData)
        .then(response => {
          if (response.code === '200') {
            message.success('注册成功！')
            localStorage.setItem("user", JSON.stringify(response.data));
            navigate('/user');
          } else {
            message.error(response.msg);
          }
        })
        .catch(error => {
          console.log(error);
        });
      }
    }

    return (
        <div className='container'>
          <h2 className='title'>小米售后维修服务工单履约系统</h2>
          <Form onFinish={handleFinish}>
            <Form.Item label="用户名" name="loginName" rules={[{ required: true, message: "请输入用户名！"}]}>
              <Input placeholder='请输入用户名' />
            </Form.Item>
            <Form.Item label="用户密码 " name="password" rules={[{ required: true, message: "请输入密码！"}]}>
              <Input.Password placeholder='请输入密码' />
            </Form.Item>
            <Form.Item label="确认密码 " name="checkPassword" rules={[{ required: true, message: "请确认密码！"}]}>
              <Input.Password placeholder='请确认密码' />
            </Form.Item>
            <Form.Item label="姓名 " name="name" rules={[{ required: true, message: "请输入姓名！"}]}>
              <Input placeholder='请输入姓名' />
            </Form.Item>
            <Form.Item label="电话 " name="phone" rules={[{ required: true, message: "请输入电话！"}]}>
              <Input placeholder='请输入电话' />
            </Form.Item>
            <Form.Item label="地址 " name="address" rules={[{ required: true, message: "请输入地址！"}]}>
              <Input placeholder='请输入地址' />
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
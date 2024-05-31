import { Button, Form, Input, Select, message } from 'antd';
import './Login.css'
import { useNavigate } from 'react-router-dom';
import { userLogin } from '../api/User';

function Login(props) {
    const navigate = useNavigate();

    const handleSitchLogin = () => {
        props.sonSwitch();
    }

    const handleFinish = (values) => {
      const { loginName, password, identity } = values;
      const loginData = {
        loginName,
        password,
        identity
      }

      //调用后端登录接口并返回结果
      userLogin(loginData)
      .then(response => {
        if (response.code === '200') {
          message.success('登录成功！')
          localStorage.setItem("user", JSON.stringify(response.data));
          if (response.data.identity === 0) {
            navigate('/user');
          } else if (response.data.identity === 1) {
            navigate('/engineer');
          } else if (response.data.identity === 2) {
            navigate('/repository');
          } 
        } else {
          message.error(response.msg);
        }
      })
      .catch(error => {
        console.log(error);
      });

    }

    return (
        <div className='loginContainer'>
          <h2 className='title'>小米售后维修服务工单履约系统</h2>
          <Form onFinish={handleFinish}>
            <Form.Item label="用户名" name="loginName" rules={[{ required: true, message: "请输入用户名！"}]}>
              <Input placeholder='请输入用户名' />
            </Form.Item>
            <Form.Item label="用户密码 " name="password" rules={[{ required: true, message: "请输入密码！"}]}>
              <Input.Password placeholder='请输入密码' />
            </Form.Item>
            <Form.Item label="用户身份 " name="identity" rules={[{ required: true, message: "请选择身份！"}]}>
              <Select 
                 placeholder="请选择身份"
                 options={[
                  {
                    value: '0',
                    label: '用户',
                  },
                  {
                    value: '1',
                    label: '工程师',
                  },
                  {
                    value: '2',
                    label: '网点',
                  },
                 ]}
              />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType="submit" size='large' className='loginBtn'>登录</Button>
            </Form.Item>
            <Form.Item>
              <a onClick={handleSitchLogin}>暂无账号？点此注册</a>
            </Form.Item>
          </Form>
        </div>
    )
}

export default Login;
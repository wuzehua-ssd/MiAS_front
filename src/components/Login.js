import { Button, Form, Input, Select, message } from 'antd';
import './Login.css'
import { useNavigate } from 'react-router-dom';

function Login(props) {
    const navigate = useNavigate();

    const handleSitchLogin = () => {
        props.sonSwitch();
    }

    const handleFinish = (values) => {
      const { username, password, identity } = values;
      console.log('用户名:', username);
      console.log('密码:', password);
      console.log('身份:', identity);
      
      //调用后端登录接口并返回结果

      //判断返回结果并进入用户/工程师/网点页面
      message.success('登录成功！')
      if (identity === 'user') {
        navigate('/user');
      } else if (identity === 'engineer') {
        navigate('/engineer');
      } else if (identity === 'repository') {
        navigate('/repository');
      } 
    }

    return (
        <div className='loginContainer'>
          <h2 className='title'>小米售后维修服务工单履约系统</h2>
          <Form onFinish={handleFinish}>
            <Form.Item label="用户名" name="username" rules={[{ required: true, message: "请输入用户名！"}]}>
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
                    value: 'user',
                    label: '用户',
                  },
                  {
                    value: 'engineer',
                    label: '工程师',
                  },
                  {
                    value: 'repository',
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
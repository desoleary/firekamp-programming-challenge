import React, {ReactNode, useState} from 'react';
import {Button, Checkbox, Form, Input, Layout, notification, Typography,} from 'antd';
import {
    FacebookOutlined,
    GithubOutlined,
    InstagramOutlined,
    LinkedinOutlined,
    LockOutlined,
    UserOutlined
} from '@ant-design/icons';
import useCsrfToken from '../hooks/useCsrfToken';

const {Content, Footer, Header} = Layout;

const {Text} = Typography;

const railsGithubSignInBtn = document.querySelector<HTMLButtonElement>("#rails-github-sign-in-button");

const LoginPageFooter = () => {
    return (<Footer style={{
            background: '#000b19',
            position: 'absolute',
            bottom: 0,
            width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px'
        }}>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <img src="/firekamp-footer-logo.svg" alt="FireKamp Logo"
                     style={{fontSize: '20px', marginRight: '8px'}}/>
                <span style={{color: 'white'}}>Copyright 2023 © Firekamp</span>
            </div>
            <div style={{display: 'flex', alignItems: 'center'}}>
                <span style={{color: 'white', marginRight: '8px'}}>Private Policy | Terms of Service |</span>
                <FacebookOutlined style={{fontSize: '20px', color: 'white', marginRight: '8px'}}/>
                <InstagramOutlined style={{fontSize: '20px', color: 'white', marginRight: '8px'}}/>
                <LinkedinOutlined style={{fontSize: '20px', color: 'white'}}/>
            </div>
        </Footer>
    );
}
const panelStyles = {display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'none', marginTop: 24, flexDirection: 'column'}

const FakeLoginForm = () => <Form
    name="normal_login"
    className="login-form"
    initialValues={{remember: true}}
    disabled={true}
>
    <Form.Item
        name="username"
        rules={[{required: true, message: 'Please input your Username!'}]}
    >
        <Input prefix={<UserOutlined className="site-form-item-icon"/>} placeholder="Username"/>
    </Form.Item>
    <Form.Item
        name="password"
        rules={[{required: true, message: 'Please input your Password!'}]}
    >
        <Input
            prefix={<LockOutlined className="site-form-item-icon"/>}
            type="password"
            placeholder="Password"
        />
    </Form.Item>
    <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="" disabled={true}>
            Forgot password
        </a>
    </Form.Item>

    <Form.Item>
        <Button type="primary"
                htmlType="submit"
                className="login-form-button"
                style={{minWidth: 176}}
        >
            Log in
        </Button>
    </Form.Item>
</Form>

const LoginPageLayout = ({children}: { children?: ReactNode }) => {
    return (
        <Layout style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'none',
            marginTop: 24,
            flexDirection: 'column'

        }}>
            <Header
                style={panelStyles}>
                <img src="/firekamp-logo.svg" alt="FireKamp Logo"/>
                <Text type="secondary" style={{marginTop: 6}}>Full Service Digital Agency. We can create
                    anything.</Text>
            </Header>
            <Content style={panelStyles}>
                {children}
            </Content>
            <LoginPageFooter/>
        </Layout>
    );
};

const LoginPage: React.FC = () => {
    const [form] = Form.useForm();
    const csrfToken: string = useCsrfToken();
    const [loading, setLoading] = useState(false);

    const openNotification = (type: 'success' | 'error') => {
        notification[type]({
            message: type === 'success' ? 'Success' : 'Error',
            description: type === 'success' ? '<%= notice %>' : '<%= alert %>',
        });
    };

    const handleSubmit = async () => {
        setLoading(true);

        railsGithubSignInBtn.click()
    }

    const onFinish = (values: any) => {
        // Perform any client-side validation or notification logic here
    };

    return (
        <div style={{textAlign: 'center'}}>
            <LoginPageLayout>
                <div style={{minWidth: 250, marginTop: 32}}>
                    <FakeLoginForm/>
                    <Form form={form}
                          onFinish={onFinish}
                          method="post"
                          action="/auth/github"
                          style={{...panelStyles, marginTop: -50}}>
                        <Form.Item>
                            <input type="hidden" name="authenticity_token" value={csrfToken}/>
                        </Form.Item>
                        <Form.Item>
                            <Button type="primary"
                                    htmlType="submit"
                                    key="submit"
                                    icon={<GithubOutlined/>}
                                    loading={loading}
                                    style={{background: "#333333"}}
                                    onClick={handleSubmit}>
                                Sign in with GitHub
                            </Button>
                        </Form.Item>
                    </Form>
                </div>

            </LoginPageLayout>
        </div>

    );
};
export default LoginPage;

import React, {ReactNode, useState} from 'react';
import {Breadcrumb, Button, Layout, theme} from 'antd';
import {LogoutOutlined} from "@ant-design/icons";
import useCsrfToken from '../hooks/useCsrfToken';


const {Content, Footer} = Layout;

const LogoutButton = () => {
    const csrfToken: string = useCsrfToken();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        setLoading(true);

        const formData = {_method: 'delete', authenticity_token: csrfToken}

        // railsSignOutBtn.click()

        fetch('/sessions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            // @ts-ignore
            body: new URLSearchParams(formData).toString()
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to logout');
                }

                window.location.href = '/sign_in';
                // Handle success response here
            })
            .catch(error => {
                console.error('Failed to logout:', error);
                // Handle error here
            });
    }

    const onFinish = (values: any) => {
        // Perform any client-side validation or notification logic here
    };


    return (
        <Button type="primary" loading={loading} onClick={handleSubmit}
                icon={<LogoutOutlined style={{float: 'left'}}/>}>
            Logout
        </Button>
    );
}


const AppLayout: React.FC = ({children}: { children?: ReactNode }) => {
    const {
        token: {colorBgContainer, borderRadiusLG},
    } = theme.useToken();

    return (
        <Layout>
            <Content style={{padding: '0 48px'}}>
                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0'}}>
                    <Breadcrumb items={[
                        {title: 'Dashboard', href: '/'},
                        {title: 'Owner'}
                    ]}/>
                    <LogoutButton/>
                </div>
                <Layout
                    style={{padding: '24px', background: colorBgContainer, borderRadius: borderRadiusLG}}
                >
                    <Content style={{background: colorBgContainer, minHeight: 280}}>{children}</Content>
                </Layout>
            </Content>
            <Footer style={{textAlign: 'center'}}>
                Ant Design ©{new Date().getFullYear()} Created by Ant UED
            </Footer>
        </Layout>
    );
};

export default AppLayout;

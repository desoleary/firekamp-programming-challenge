import React, {ReactNode, useState} from "react"
import {Button, Col, Descriptions, Divider, Form, Input, Layout, Row, Table, TableProps, Typography} from 'antd';
import AppLayout from "./AppLayout";

const {Title} = Typography

interface RepositoryType {
    id: string;
    name: string;
    description: string;
    homepageUrl: string;
    diskUsage: string;
    createdAt: string;
    updatedAt: string;
}

interface UserInfoType {
    id: string;
    login: string;
    email: string;
    url: string;
    repositories: {
        nodes: RepositoryType[]
    }
}

const csrfTokenElement = document.head.querySelector("[name='csrf-token']") as HTMLMetaElement;
const csrfToken = csrfTokenElement ? csrfTokenElement.content : '';

const getUserInfoItems = ({login, email, url}: Omit<UserInfoType, 'repositories'>) => {
    return [
        {
            key: 'login',
            label: 'Username',
            children: login,
        },
        {
            key: 'email',
            label: 'Email',
            children: email,
        },
        {
            key: 'url',
            label: 'URL',
            children: url,
        }
    ]
}

const columns: TableProps<RepositoryType>['columns'] = [
    {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Created',
        dataIndex: 'createdAt',
        key: 'createdAt',
    }, {
        title: 'Last Updated',
        dataIndex: 'updatedAt',
        key: 'updatedAt',
    }
]

function addKeyToRepositories(repoList: RepositoryType[]): ({ key: string } & RepositoryType)[] {
    return repoList.map(repo => ({
        key: repo.id,
        ...repo
    }));
}

const ContentLayout = ({children}: { children?: ReactNode }) => (
    <Layout.Content style={{
        margin: '12px 16px',
        padding: 12,
        background: 'white'
    }}>
        {children}
    </Layout.Content>
);

const TitlePanel = ({children}: { children?: ReactNode }) => <Title level={2}
                                                                    style={{margin: '12px 16px'}}>{children}</Title>


const RepositoriesTable = ({data}: { data: RepositoryType[] }) => {
    const repositoriesData = addKeyToRepositories(data)

    const formLayout = {
        labelCol: {span: 6},
        wrapperCol: {span: 16},
    };

    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);
    const [form] = Form.useForm();


    const handleExpand = (expanded: boolean, record: RepositoryType) => {
        setExpandedRowKeys(expanded ? [record.id] : []);
    };

    // Helper function to humanize field names
    const camelCaseToHumanized = (str: string) => {
        // Split camelCase string into separate words
        const words = str.replace(/([a-z])([A-Z])/g, '$1 $2').split(' ');
        // Capitalize the first letter of each word
        return words.map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    };


    const generateFormItems = (record: RepositoryType, fields: string[], editableFields: string[]) => {
        return fields
            .map((field) => {
                const formItemProps = {
                    key: field,
                    name: field,
                    label: camelCaseToHumanized(field),
                    initialValue: record[field]
                }
                return (
                    <Form.Item {...formItemProps}>
                        <Input disabled={!editableFields.includes(field)}/>
                    </Form.Item>
                );
            });
    };

    const IncludeExcludeHiddenId: React.FC<{ record: RepositoryType, includeHiddenIdField: boolean }> = ({
                                                                                                             record,
                                                                                                             includeHiddenIdField
                                                                                                         }) => {
        if (!includeHiddenIdField) {
            return null; // If includeHiddenIdField is false, don't render anything
        }

        return (
            <Form.Item name="id" style={{display: 'none'}} initialValue={record.id}>
                <Input type="hidden"/>
            </Form.Item>
        );
    };
    const withExpandedRowRender = ({
                                       editableFields = [], excludedFields = [], includeHiddenIdField = false
                                   }: {
        editableFields: string[],
        excludedFields: string[],
        includeHiddenIdField: boolean
    }) => (record: RepositoryType) => {
        const fields = Object.keys(record)
            .filter(field => !excludedFields.includes(field));
        const halfLength = Math.ceil(fields.length / 2);
        const leftFields = fields.slice(0, halfLength);
        const rightFields = fields.slice(halfLength);

        return (
            <Form form={form} onFinish={handleSave} {...formLayout}>
                <IncludeExcludeHiddenId record={record} includeHiddenIdField={includeHiddenIdField}/>
                <Row gutter={24}>
                    <Col span={12}>{generateFormItems(record, leftFields, editableFields)}</Col>
                    <Col span={12}>{generateFormItems(record, rightFields, editableFields)}</Col>
                </Row>
                <Form.Item wrapperCol={{span: 2, offset: 22}}>
                    <Button type="primary" htmlType="submit" style={{marginLeft: -3}}>
                        Save
                    </Button>
                </Form.Item>
            </Form>
        );
    }

    const handleSave = () => {
        form
            .validateFields()
            .then((values) => {
                // Handle form submission, e.g., update repository data
                console.log('Form values:', values);

                // Send the form data to the server
                fetch('/github/repositories/update', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-Token': csrfToken,
                    },
                    body: JSON.stringify({repository: values}),
                })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Failed to update repository');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log('Repository updated successfully:', data);
                    })
                    .catch(error => {
                        console.error('Failed to update repository:', error);
                    });
            })
            .catch((error) => {
                console.error('Validation failed:', error);
            });
    };

    const expandedRowRender = withExpandedRowRender({
        editableFields: ['description'],
        excludedFields: ['id', 'key'],
        includeHiddenIdField: true
    })


    return <Table
        columns={columns}
        dataSource={repositoriesData}
        expandable={{expandedRowRender, expandedRowKeys, onExpand: handleExpand, expandRowByClick: true}}
    />
}

const SectionTitle = ({children}: { children?: ReactNode }) => <div style={{marginTop: 12}}><Divider/><TitlePanel>{children}</TitlePanel><Divider/></div>

const HomeIndexPage = (data: UserInfoType) => {
    const {repositories, ...userInfo} = data
    const userInfoItems = getUserInfoItems(userInfo)

    return (
        <AppLayout>
            <SectionTitle>User Info</SectionTitle>
            <ContentLayout>
                <Descriptions column={1} items={userInfoItems}/>
            </ContentLayout>
            <SectionTitle>Repositories</SectionTitle>
            <ContentLayout>
                <RepositoriesTable data={repositories.nodes}/>
            </ContentLayout>
        </AppLayout>
    )
}

export default HomeIndexPage

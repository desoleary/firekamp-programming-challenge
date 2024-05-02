import React, {ReactNode, useRef, useState} from "react"
import {Button, Descriptions, Divider, Form, Layout, Table, TableProps, Typography} from 'antd';
import AppLayout from "./AppLayout";
import RjsfForm from '@rjsf/antd';
import validator from '@rjsf/validator-ajv8';
import styled from "styled-components";

const formConfig = {
    schema: {
        "type": "object",
        "required": [
            "description"
        ],
        "properties": {
            "name": {
                "type": "string",
                "title": "Name"
            },
            "description": {
                "type": "string",
                "title": "Description"
            },
            "diskUsage": {
                "type": "number",
                "title": "Disk Usage"
            },
            "createdAt": {
                "type": "string",
                "title": "Created At"
            },
            "updatedAt": {
                "type": "string",
                "title": "Updated At"
            }
        }
    },
    uiSchema: {
        "name": {
            'ui:options': {
                disabled: true
            }
        },
        "description": {
            "ui:widget": "textarea"
        },
        "diskUsage": {
            'ui:options': {
                disabled: true
            }
        }, "createdAt": {
            'ui:options': {
                disabled: true
            }
        }, "updatedAt": {
            'ui:options': {
                disabled: true
            }
        },
    },
    formContext: {
        colSpan: 12
    }
};

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

const StyledFormWrapper = styled.section`
  fieldset {
    border: none;
  }

  #firekamp-github-repo-submit-btn {
    width: 85px;
  }
`;


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


    const handleExpand = (expanded: boolean, record: RepositoryType) => {
        setExpandedRowKeys(expanded ? [record.id] : []);
    };

    const [isUpdating, setIsUpdating] = useState(false);
    const formDataMapRef = useRef({});

    // Helper function to humanize field names

    const withExpandedRowRender = () => (record: RepositoryType) => {
        // in order to keep number of hooks rendered consistent we need to make use of useRef in the parent component
        const currentFormData = formDataMapRef.current[record.id] = formDataMapRef.current[record.id] ?? record

        const handleSave = ({formData}) => {
            formDataMapRef.current[record.id] =  {...currentFormData, ...formData}
            setIsUpdating(true)
            fetch('/github/repositories/update', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-Token': csrfToken,
                },
                body: JSON.stringify({repository: formData}),
            })
                .then(response => {
                    setIsUpdating(false)
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
        };

        return (
            <StyledFormWrapper><RjsfForm schema={formConfig.schema} uiSchema={formConfig.uiSchema}
                                         formData={currentFormData}
                                         formContext={formConfig.formContext} validator={validator}
                                         onSubmit={handleSave}>
                <Form.Item wrapperCol={{span: 2, offset: 22}}>
                    <Button id="firekamp-github-repo-submit-btn" type="primary" htmlType="submit"
                            style={{marginLeft: -3}} loading={isUpdating}>
                        Save
                    </Button>
                </Form.Item>
            </RjsfForm></StyledFormWrapper>
        );
    }

    const expandedRowRender = withExpandedRowRender()


    return <Table
        columns={columns}
        dataSource={repositoriesData}
        expandable={{expandedRowRender, expandedRowKeys, onExpand: handleExpand, expandRowByClick: true}}
    />
}

const SectionTitle = ({children}: { children?: ReactNode }) => <div style={{marginTop: 12}}>
    <Divider/><TitlePanel>{children}</TitlePanel><Divider/></div>


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

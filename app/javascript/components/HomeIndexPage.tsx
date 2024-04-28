import React, {ReactNode, useState, useRef, useContext, useEffect} from "react"
import {Descriptions, Layout, Table, Form, TableProps, Typography, GetRef, InputRef, Tooltip, Input} from 'antd';

const {Title} = Typography

type FormInstance<T> = GetRef<typeof Form<T>>;

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
    return <Table
        columns={columns}
        dataSource={repositoriesData}/>
}
const HomeIndexPage = (data: UserInfoType) => {
    const { repositories, ...userInfo} = data
    const userInfoItems = getUserInfoItems(userInfo)

    return (
        <React.Fragment>
            <Layout>
                <TitlePanel>User Info</TitlePanel>
                <ContentLayout>
                    <Descriptions column={1} items={userInfoItems}/>
                </ContentLayout>
                <TitlePanel>Repositories</TitlePanel>
                <ContentLayout>
                    <RepositoriesTable data={repositories.nodes}/>
                </ContentLayout>
            </Layout>
        </React.Fragment>
    )
}

export default HomeIndexPage

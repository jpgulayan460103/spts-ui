import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Badge  } from 'antd';
import { DashboardOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import queryString from "query-string";
import { useRouter } from 'next/router'

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;
function mapStateToProps(state) {
  return {
    sentCount: state.smsBlast.sentCount,
    recipients: state.smsBlast.recipients,
    sendStatus: state.smsBlast.sendStatus,
  };
}
const Menus = (props) => {
  const [collapsed, setCollapsed] = useState(true);
  const router = useRouter()
  router.query = queryString.parse(router.asPath.split(/\?/)[1]);
  var {route} = router;
  var {id} = router.query;

  const onCollapse = () => {
    setCollapsed(!collapsed);
  }
  
  return (
    <React.Fragment>
        <Sider collapsible collapsed={collapsed} onCollapse={onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={[route]} mode="inline">
            <Menu.Item key="/">
              <DashboardOutlined />
              <span>Dashboard</span>
            </Menu.Item>
            <Menu.Item key="/students">
              <UserOutlined />
              <Link href="/students">
                <a>Students</a>
              </Link>
            </Menu.Item>
            <Menu.Item key="/sections">
              <UserOutlined />
              <Link href="/sections">
                <a>Sections</a>
              </Link>
            </Menu.Item>
            <SubMenu
              key="sub1"
              title={
                <span>
                  <UserOutlined />
                  <span>User</span>
                </span>
              }
            >
              <Menu.Item key="3">Tom</Menu.Item>
              <Menu.Item key="4">Bill</Menu.Item>
              <Menu.Item key="5">Alex</Menu.Item>
            </SubMenu>
            <SubMenu
              key="sub2"
              title={
                <span>
                  <UserOutlined />
                  <span>Team</span>
                </span>
              }
            >
              <Menu.Item key="6">Team 1</Menu.Item>
              <Menu.Item key="8">Team 2</Menu.Item>
            </SubMenu>
            <Menu.Item key="9">
              <UserOutlined />
            </Menu.Item>
          </Menu>
        </Sider>
      </React.Fragment>
  );
}

export default connect(
  mapStateToProps,
)(Menus);


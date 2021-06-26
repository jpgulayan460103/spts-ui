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
    menuCollapsed: state.appDefault.menuCollapsed,
    role: state.user.role,
  };
}
const Menus = (props) => {
  const router = useRouter()
  router.query = queryString.parse(router.asPath.split(/\?/)[1]);
  var {route} = router;
  var {id} = router.query;

  const onCollapse = () => {
    props.dispatch({
      type: "SET_MENU_COLLAPSED",
      data: !props.menuCollapsed
    });
  }
  
  return (
    <React.Fragment>
        <Sider collapsible collapsed={props.menuCollapsed} onCollapse={onCollapse}>
          <div className="logo" />
          <Menu theme="dark" defaultSelectedKeys={[route]} mode="inline">
            { props.role.name == "admin" ? (
              <Menu.Item key="/">
                <DashboardOutlined />
                <Link href="/">
                  <a>Dashboard</a>
                </Link>
              </Menu.Item>
            ) : "" }
            { props.role.name == "admin" ? (
              <Menu.Item key="/students">
                <UserOutlined />
                <Link href="/students">
                  <a>Students</a>
                </Link>
              </Menu.Item>
            ) : "" }
            { props.role.name == "admin" ? (
              <Menu.Item key="/teachers">
                <UserOutlined />
                <Link href="/teachers">
                  <a>Teacher</a>
                </Link>
              </Menu.Item>
            ) : "" }
            { props.role.name == "admin" || props.role.name == "teacher" ? (
              <Menu.Item key="/sections">
                <UserOutlined />
                <Link href="/sections">
                  <a>Sections</a>
                </Link>
              </Menu.Item>
            ) : "" }
            { props.role.name == "admin" ? (
              <Menu.Item key="/subjects">
                <UserOutlined />
                <Link href="/subjects">
                  <a>Subjects</a>
                </Link>
              </Menu.Item>
            ) : "" }

          </Menu>
        </Sider>
      </React.Fragment>
  );
}

export default connect(
  mapStateToProps,
)(Menus);


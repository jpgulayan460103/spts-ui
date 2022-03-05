import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Badge  } from 'antd';
import { DashboardOutlined, UserOutlined, TeamOutlined, ApartmentOutlined, SolutionOutlined, ReadOutlined } from '@ant-design/icons';
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
        <Sider onCollapse={onCollapse}>
          <div className="logo" />

        </Sider>
      </React.Fragment>
  );
}

export default connect(
  mapStateToProps,
)(Menus);


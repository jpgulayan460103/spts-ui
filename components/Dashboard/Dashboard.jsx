import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Typography, Table } from 'antd';
import _isEmpty from 'lodash/isEmpty'
import Router from 'next/router'

const { Title } = Typography;

function mapStateToProps(state) {
  return {
    user: state.user.user,
  };
}


const Dashboard = (props) => {
  const logout = () => {
    props.dispatch({
      type: "USER_LOGIN_FAILED",
      data: {}
    });
    Router.push('/login')
  }
  return (
    <div>
      <div>
          {props.user ?<div className="text-center"> Welcome, <b>{props.user.username}</b></div>: ""}
          <ul className="list-group">
            <li className="list-group-item menu-select">Change Password</li>
            <li className="list-group-item menu-select" onClick={() => logout()}>Logout</li>
          </ul>
      </div>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(Dashboard);
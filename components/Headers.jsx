import React, { useState } from 'react';
import { connect } from 'react-redux';
import Router from 'next/router'
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  NavbarText
} from 'reactstrap';
import { CaretDownOutlined } from '@ant-design/icons';
import { Popover, Button } from 'antd';
import Link from 'next/link'


const mapStateToProps = (state) => ({
  isLogged: state.user.isLogged,
  accessToken: state.user.accessToken,
  user: state.user.user,
});


const RightMenu = (props) => {
  return (
    <div>
        {props.user ?<div className="text-center"> Welcome, <b>{props.user.username}</b></div>: ""}
        <ul className="list-group">
          <li className="list-group-item menu-select">Change Password</li>
          <li className="list-group-item menu-select" onClick={() => props.logout()}>Logout</li>
        </ul>
    </div>
  );
}



const Headers = (props) => {
  const [visible, setVisible] = useState(false);
  const [isOpen, setisOpen] = useState(false);

  const loggedState = () => {
    if(props.isLogged){
      return (
        <Popover
          content={<RightMenu logout={logout} user={props.user}/>}
          trigger="click"
          placement="bottomRight"
          visible={visible}
          onVisibleChange={handleVisibleChange}
        >
        <span style={{cursor: "pointer"}}><CaretDownOutlined /></span>
      </Popover>
      )
    }else{
      return (
        <NavItem>
          <NavLink href="/login" onClick={() => logout}>Login</NavLink>
        </NavItem>
      )
    }
  }
  const logout = () => {
    props.dispatch({
      type: "USER_LOGIN_FAILED",
      data: {}
    });
    Router.push('/login')
  }
  const handleVisibleChange = visible => {
    setVisible(visible)
  };
  const redirect = (redirectTo) => {
    Router.push(`/${redirectTo}`)
  }
  return (
    <React.Fragment>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="#!"  onClick={() => redirect('') }>
        {/* <img src="/images/logo.png" className="h-16 w-16 mr-2 full mx-auto float-left" alt=""/>  */}
        {/* <span className="pl-2 text-base font-semibold m-0">STUDENT PERFORMANCE</span><br /> */}
        {/* <span className="pl-2 text-base font-semibold m-0">TRACKING SYSTEM</span> */}
        </NavbarBrand>
        <Nav navbar className="ml-auto">
          {loggedState()}
          </Nav>
      </Navbar>
    </React.Fragment>
  );
}
export default connect(mapStateToProps)(Headers);
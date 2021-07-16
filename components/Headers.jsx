import React, { Component } from 'react';
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

class Headers extends Component {
  constructor(props){
    super(props);
    this.state = {
      accessToken: "",
      isLogged: false,
      visible: false,
    };
    this.toggle = this.toggle.bind(this);
    this.loggedState = this.loggedState.bind(this);
    this.logout = this.logout.bind(this);
    this.handleVisibleChange = this.handleVisibleChange.bind(this);
    this.hide = this.hide.bind(this);
  }
  static getDerivedStateFromProps(props, state) {
    return {
      isLogged: props.isLogged,
      accessToken: props.accessToken,
    };
  }
  toggle = () => {
    this.setState({isOpen: !this.state.isOpen});
  }
  loggedState = () => {
    if(this.state.isLogged){
      return (
        <Popover
          content={<RightMenu logout={this.logout} user={this.props.user}/>}
          trigger="click"
          placement="bottomRight"
          visible={this.state.visible}
          onVisibleChange={this.handleVisibleChange}
        >
        <span style={{cursor: "pointer"}}><CaretDownOutlined /></span>
      </Popover>
      )
    }else{
      return (
        <NavItem>
          <NavLink href="/login" onClick={() => this.logout}>Login</NavLink>
        </NavItem>
      )
    }
  }
  logout = () => {
    this.props.dispatch({
      type: "USER_LOGIN_FAILED",
      data: {}
    });
    Router.push('/login')
  }
  hide = () => {
    this.setState({
      visible: false,
    });
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };
  redirect = (redirectTo) => {
    Router.push(`/${redirectTo}`)
  }
  render() {
    return (
      <React.Fragment>
      <Navbar color="light" light expand="md">
        <NavbarBrand href="#!"  onClick={() => this.redirect('') }>
        <img src="/images/logo.png" className="h-16 w-16 mr-2 full mx-auto float-left" alt=""/> 
        <span className="pl-2 text-base font-semibold m-0">STUDENT PERFORMANCE</span><br />
        <span className="pl-2 text-base font-semibold m-0">TRACKING SYSTEM</span>
        </NavbarBrand>
        <Nav navbar className="ml-auto">
          {this.loggedState()}
          </Nav>
      </Navbar>
    </React.Fragment>
    );
  }
}

const mapStateToProps = (state) => ({
  isLogged: state.user.isLogged,
  accessToken: state.user.accessToken,
  user: state.user.user,
});
export default connect(mapStateToProps)(Headers);
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Modal } from 'antd';
import API from '../api'
import Router from 'next/router'
import { LockOutlined, UserOutlined } from '@ant-design/icons';

function mapStateToProps(state) {
  return {

  };
}

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 24,
  },
};
const tailLayout = {
  wrapperCol: {
    span: 24,
  },
};


class LoginForm extends Component {
  constructor(props){
    super(props);
    this.state = {
      formError: {}
    }
    this.handleTest = this.handleTest.bind(this);
    this.onFinish = this.onFinish.bind(this);
    this.onFinishFailed = this.onFinishFailed.bind(this);
  }
  
  handleTest = () => {
    API.User.getUsers()
      .then(res => {
        
      })
      .catch(err => {

      })
      .then(res => {})
  }
  onFinish = values => {
    // console.log('Success:', values);
    API.User.login(values)
    .then(res => {
      this.props.dispatch({
        type: "USER_LOGIN_SUCCESSFUL",
        data: res.data
      });
      window.location = "/";
      // Router.push('/')
    })
    .catch(err => {
      if(err.response && err.response.data){
        this.props.dispatch({
          type: "USER_LOGIN_FAILED",
          data: err
        });
        this.setState({formError: err.response.data});
        Modal.error({
          title: 'Login failed.',
          content: 'Invalid username or password.',
        });
        // Router.push('/login')
      }
    })
    .then(res => {})
  }
  onFinishFailed = errorInfo => {
    // console.log('Failed:', errorInfo);
  }
  render() {
    return (
      <div>
        <img src="/images/logo.png" className="h-40 w-40 full mx-auto" alt=""/>
        <h3 style={{textAlign: "center"}} className="mb-10">Account Login</h3>
        <Form
          {...layout}
          name="basic"
          layout="vertical"
          initialValues={{
            remember: true,
          }}
          onFinish={this.onFinish}
          onFinishFailed={this.onFinishFailed}
        >
          <Form.Item
            label=""
            name="username"
            rules={[
              {
                required: true,
                message: 'Please input your username!',
              },
            ]}
          >
            <Input placeholder="Type your username" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            label=""
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password placeholder="Type your password" prefix={<LockOutlined />} />
          </Form.Item>

          

          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" size="large" block>
              Login
            </Button>
          </Form.Item>

        </Form>
      </div>
    );
  }
}

export default connect(
  mapStateToProps,
)(LoginForm);
import Head from 'next/head'
import React, { Component } from 'react';
import LoginForm from '../components/LoginForm'
import { Provider } from 'react-redux'
import store from '../store'
import Layouts from './../layouts/layouts'
import Router from 'next/router'

export class index extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
  }
  render() {
    
    return (
      <Provider store={store}>
        <Head>
          <title>Login</title>
          <link rel="stylesheet" type="text/css" href="/login.css"></link>
        </Head>
        <div className="container-fluid">
            <div className="row justify-content-center">
              <div>
                <div className="mt-20 p-10" style={{border: "1px solid black"}}>
                  <LoginForm />
                </div>
              </div>
            </div>
          </div>
      </Provider>
    );
  }
}

export default index;

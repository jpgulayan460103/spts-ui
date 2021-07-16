import Head from 'next/head'
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux'
import store from '../store'
import Layouts from './../layouts/layouts'
import ls from 'local-storage'
import ClassSectionParent from '../components/ClassSection/ClassSection'
import Portfolio from './../components/Student/Portfolio'

const index = (props) => {
  const [userRole, setUserRole] = useState("");
  useEffect(() => {
    let user = ls('user');
    if(!user){
      Router.push('/login')
    }else{
      let role = user.user.roles[0].name;
      setUserRole(role);
    }
  }, []);
  return (
    <Provider store={store}>
      <Head>
        <title>Dashboard</title>
      </Head>
      <Layouts>
        { userRole == "teacher" ? <ClassSectionParent /> : "" }
        { userRole == "student" ? <Portfolio /> : "" }
      </Layouts>
    </Provider>
  );
};

export default index;

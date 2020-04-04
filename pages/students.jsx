import Head from 'next/head'
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux'
import store from '../store'
import Layouts from './../layouts/layouts'
import StudentForm from '../components/Student/StudentForm'
import StudentTable from '../components/Student/StudentTable'


const StudentIndex = (props) => {
  return (
    <Provider store={store}>
      <Head>
        <title>Students</title>
      </Head>
      <Layouts>
        <div className="row">
          <div className="col-md-3">
            <StudentForm />
          </div>
          <div className="col-md-9">
            <StudentTable />
          </div>
        </div>
      </Layouts>
    </Provider>
  );
};

export default StudentIndex;

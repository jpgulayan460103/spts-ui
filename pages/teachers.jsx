import Head from 'next/head'
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux'
import store from '../store'
import Layouts from './../layouts/layouts'
import TeacherForm from '../components/Teacher/TeacherForm'
import TeacherTable from '../components/Teacher/TeacherTable'


const TeacherIndex = (props) => {
  return (
    <Provider store={store}>
      <Head>
        <title>Teachers</title>
      </Head>
      <Layouts>
        <div className="row">
          <div className="col-md-3">
            <TeacherForm />
          </div>
          <div className="col-md-9">
            <TeacherTable />
          </div>
        </div>
      </Layouts>
    </Provider>
  );
};

export default TeacherIndex;

import Head from 'next/head'
import React, { useState, useEffect } from 'react';
import { Provider } from 'react-redux'
import store from '../store'
import Layouts from './../layouts/layouts'
import SubjectStudentForm from '../components/Subject/SubjectStudentForm'
import SubjectTable from '../components/Subject/SubjectTable'


const SubjectIndex = (props) => {
  return (
    <Provider store={store}>
      <Head>
        <title>Subjects</title>
      </Head>
      <Layouts>
        <div className="row">
          <div className="col-md-3">
            <SubjectStudentForm />
          </div>
          <div className="col-md-9">
            <SubjectTable />
          </div>
        </div>
      </Layouts>
    </Provider>
  );
};

export default SubjectIndex;

import Head from 'next/head'
import React, { useState } from 'react';
import { Provider } from 'react-redux'
import store from '../store'
import Layouts from './../layouts/layouts'
import ClassSectionParent from '../components/ClassSection/ClassSection'

const sectionIndex = () => {
  return (
    <Provider store={store}>
      <Head>
        <title>Sections</title>
      </Head>
      <Layouts>
        <ClassSectionParent />
      </Layouts>
    </Provider>
  );
};

export default sectionIndex;
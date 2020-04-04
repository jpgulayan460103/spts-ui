import Head from 'next/head'
import React, { Component } from 'react';
import { Provider } from 'react-redux'
import store from '../store'
import Layouts from './../layouts/layouts'
import ClassSectionForm from '../components/ClassSection/ClassSectionForm'
import ClassSectionTable from '../components/ClassSection/ClassSectionTable'

export class SectionIndex extends Component {
  constructor(props){
    super(props);
    this.state = {
      
    }
  }
  render() {
    
    return (
      <Provider store={store}>
        <Head>
          <title>Students</title>
        </Head>
        <Layouts>
          <div className="row">
            <div className="col-md-3">
              <ClassSectionForm />
            </div>
            <div className="col-md-9">
              <ClassSectionTable />
            </div>
          </div>
        </Layouts>
      </Provider>
    );
  }
}

export default SectionIndex;

import React, { useState } from 'react';
import { connect } from 'react-redux';
import ResidentForm from './components/ResidentForm'
import { Table, Tag } from 'antd';

function mapStateToProps(state) {
  return {
    
  };
}

const Resident = (props) => {
  return (
    <div className="row">
      <div className="col-md-12">
        <ResidentForm />
      </div>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(Resident);
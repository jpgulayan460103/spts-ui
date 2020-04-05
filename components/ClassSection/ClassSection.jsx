import React, { useState } from 'react';
import { connect } from 'react-redux';
import ClassSectionStudentForm from './ClassSectionStudentForm'
import ClassSectionTable from './ClassSectionTable'
import ClassSectionForm from './ClassSectionForm'

function mapStateToProps(state) {
  return {
    formType: state.classSection.formType,
  };
}
const ClassSectionParent = (props) => {
  return (
    <div className="row">
      { props.formType != "student" ? (
        <>
          <div className="col-md-3">
            <ClassSectionForm />
          </div>
          <div className="col-md-9">
            <ClassSectionTable />
          </div>
        </>
      ) : (
        <div className="col-md-12">
          <ClassSectionStudentForm />
        </div>
      ) }
    </div>
  );
}



export default connect(
  mapStateToProps,
)(ClassSectionParent);
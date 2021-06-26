import React, { useState } from 'react';
import { connect } from 'react-redux';
import ClassSectionStudentForm from './ClassSectionStudentForm'
import ClassSectionTable from './ClassSectionTable'
import ClassSectionForm from './ClassSectionForm'

function mapStateToProps(state) {
  return {
    formType: state.classSection.formType,
    role: state.user.role,
  };
}
const ClassSectionParent = (props) => {
  return (
    <div className="row">
      { props.role.name == "admin" ? <Admin {...props} /> : ""}
      { props.role.name == "teacher" ? <Teacher {...props} /> : ""}
    </div>
  );
}

const Admin = (props) => {
  return (
    <React.Fragment>
      { props.formType != "student" ? (
        <React.Fragment>
          <div className="col-md-3">
            <ClassSectionForm />
          </div>
          <div className="col-md-9">
            <ClassSectionTable />
          </div>
        </React.Fragment>
      ) : (
        <div className="col-md-12">
          <ClassSectionStudentForm />
        </div>
      ) }
    </React.Fragment>
  )
};

const Teacher = (props) => {
  return (
    <React.Fragment>
      { props.formType != "student" ? (
        <React.Fragment>
          <div className="col-md-12">
            <ClassSectionTable />
          </div>
        </React.Fragment>
      ) : (
        <div className="col-md-12">
          <ClassSectionStudentForm />
        </div>
      ) }
    </React.Fragment>
  )
};



export default connect(
  mapStateToProps,
)(ClassSectionParent);
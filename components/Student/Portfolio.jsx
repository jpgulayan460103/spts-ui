import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import API from '../../api';
import { Typography, Table } from 'antd';
import StudentSection from './StudentSection'
import _isEmpty from 'lodash/isEmpty'

const { Title } = Typography;

function mapStateToProps(state) {
  return {
    user: state.user.user,
  };
}
const handleClick = () => {}


const Portfolio = (props) => {
  useEffect(() => {
    getStudentData();
  }, []);

  //states
  const [userData, setUserData] = useState({});
  const [selectedSubject, setSelectedSubject] = useState({});


  //data

  const columns = [
    {
      title: 'School Year',
      key: 'grade_level',
      render: (text, record) => (
        <span>
          <span>{record.quarter.name == "First Semester" ? "Q1" : "Q2"} {record.school_year}</span>
        </span>
      ),
    },
    {
      title: 'Grade/Section',
      dataIndex: 'grade_level',
      key: 'grade_level',
      render: (text, record) => (
        <span>
          <span>{record.grade_level}</span> - <span>{record.section_name}</span>
        </span>
      ),
    },
    {
      title: 'Semester',
      dataIndex: 'view_class',
      render: (text, record) => (
        <span>
          <a href="#!" onClick={() => { clickSection(record) }}>View {record.semester.name == "First Semester" ? "1st" : "2nd"} Semester</a>
        </span>
      ),
    },
  ];


  //actions 

  const getStudentData = () => {
    API.Student.get(props.user.userable_id)
    .then(res => {
      setUserData(res.data.student);
    })
    .catch(res => {})
    .then(res => {})
  }

  const clickSection = (data) => {
    setSelectedSubject(data);
  }
  return (
    <div>
      <Title level={4}>PERSONAL DETAILS</Title>
      <span><b>ID Number:</b> {userData.student_id_number}</span><br />
      <span><b>Name:</b> {userData.full_name_last}</span><br />
      <span><b>Gender:</b> {userData.gender}</span><br />
      <br />
      { !_isEmpty(selectedSubject) ? (
        <React.Fragment>
          <Title level={4}>ENROLLED CLASS</Title>
          <span><b>Grade/Section:</b> <span>{selectedSubject.grade_level}</span> - <span>{selectedSubject.section_name}</span></span><br />
          <span><b>School Year:</b> <span>{selectedSubject.quarter?.name == "First Semester" ? "Q1" : "Q2"} {selectedSubject.school_year}</span></span><br />
          <span><b>Semester:</b> <span>{selectedSubject.semester?.name == "First Semester" ? "1st" : "2nd"} Semester</span></span><br />
        </React.Fragment>
      ) : <Title level={4}>ENROLLED CLASSES</Title> }

      

      { _isEmpty(selectedSubject) ? (
        <React.Fragment>
          <div className="table-responsive">
          <Table columns={columns} dataSource={userData?.class_sections?.data} />
          </div>
        </React.Fragment>
      ) : <StudentSection /> }
    </div>
  );
}



export default connect(
  mapStateToProps,
)(Portfolio);
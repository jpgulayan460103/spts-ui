import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import API from '../../api';
import { Typography, Table } from 'antd';

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
          <span>{record.semester.name == "First Semester" ? "1st" : "2nd"}</span>
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
  return (
    <div>
      <Title level={4}>PERSONAL DETAILS</Title>
      <p><b>ID Number:</b> {userData.student_id_number}</p>
      <p><b>Name:</b> {userData.full_name_last}</p>
      <p><b>Gender:</b> {userData.gender}</p>

      <Title level={4}>Enrolled Classes</Title>
      <div className="table-responsive">
      <Table columns={columns} dataSource={userData?.class_sections?.data} />
      </div>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(Portfolio);
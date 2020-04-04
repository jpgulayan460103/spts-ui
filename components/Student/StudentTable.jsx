import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Typography, Divider, Pagination, Modal, Select, Input, Button } from 'antd';
import _isEmpty from 'lodash/isEmpty'
import API from '../../api'

function mapStateToProps(state) {
  return {
    students: state.student.students,
    pagination: state.student.tablePagination,
    searchData: state.student.searchData,
    student: state.student.student,
  };
}
const handleClick = () => {}
const StudentTable = (props) => {
  useEffect(() => {
    getStudents();
  }, [props.student]);

  const [loading, setLoading] = useState(false);

  const handleResidentPage = (val) => {
    getStudents(val);
  }
  const getStudents = (page = 1) => {
    setLoading(true);
    let filterOptions = {
      page: page,
      ...props.searchData
    }
    API.Student.all(filterOptions)
    .then((res) => {
      let result = res.data.students.data;
      let resultPagination = res.data.students.meta.pagination;
      setLoading(false);
      props.dispatch({
        type: "SET_STUDENTS",
        data: result
      })
      props.dispatch({
        type: "SET_STUDENTS_PAGINATION",
        data: resultPagination
      })
    })
    .catch((err) => {
      setLoading(false);
    })
    .then((res) => {
      setLoading(false);
    })
  }
  
  const dataSource = props.students;
  const columns = [
    {
      title: 'ID Number',
      dataIndex: 'student_id_number',
      key: 'student_id_number',
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name',
      render: (text, record) => (
        <span>
          {`${record.last_name}, ${record.first_name} ${record.middle_name} ${record.ext_name}`}
        </span>
      ),
    },
    {
      title: 'Section',
      dataIndex: 'section_name',
      render: (text, record) => (
        <span>
          {`${record.class_section.section_name}`}
        </span>
      ),
    },
    {
      title: 'Grade Level',
      dataIndex: 'grade_level',
      render: (text, record) => (
        <span>
          {`${record.class_section.grade_level}`}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a>Edit</a>
          &nbsp;|&nbsp;
          <a>Delete</a>
        </span>
      ),
    }
  ];
  
  const paginationConfig = {
    defaultCurrent: !_isEmpty(props.pagination) ? props.pagination.current_page : 0,
    total: !_isEmpty(props.pagination) ? props.pagination.total : 0,
    pageSize: !_isEmpty(props.pagination) ? props.pagination.per_page : 0,
  };

  


  return (
    <div>

      <Table dataSource={dataSource} columns={columns} pagination={false} loading={loading} />
      <Divider />
      {!_isEmpty(props.students) ? (<Pagination {...paginationConfig} onChange={handleResidentPage} />): ""}
    </div>
  );
}



export default connect(
  mapStateToProps,
)(StudentTable);
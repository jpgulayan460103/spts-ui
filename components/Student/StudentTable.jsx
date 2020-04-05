import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Typography, Divider, Pagination, Modal, Select, Input, Button } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import _isEmpty from 'lodash/isEmpty'
import API from '../../api'
const { Search } = Input;
const { Option } = Select;

function mapStateToProps(state) {
  return {
    students: state.student.students,
    pagination: state.student.tablePagination,
    updatedStudent: state.student.updatedStudent,
  };
}
const handleClick = () => {}
const StudentTable = (props) => {
  useEffect(() => {
    getStudents();
  }, [props.updatedStudent]);

  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({});
  const selectStudent = (student) => {
    props.dispatch({
      type: "SELECT_STUDENT",
      data: student
    });
  }
  const deleteStudent = (student) => {
    API.Student.delete(student.id)
    .then((res) => {
      getStudents(1);
    })
  }
  const handleResidentPage = (val) => {
    getStudents(val);
  }
  const getStudents = (page = 1) => {
    setLoading(true);
    let filterOptions = {
      page: page,
      ...searchData
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
  const setSearchString = (e) => {
    let string = e.target.value;
    setSearchData({...searchData,query:string});
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
      dataIndex: 'full_name_last',
      key: 'full_name_last',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => {selectStudent(record)} }>Edit</a>
          &nbsp;|&nbsp;
          <a onClick={() => {deleteStudent(record)} }>Delete</a>
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

      <Search
        allowClear
        placeholder="input search text"
        onChange={value => setSearchString(value)}
        style={{ width: 200 }}
        onSearch={() => {getStudents()}}
      />

      <Divider />
      <div className="table-responsive">
        <Table dataSource={dataSource} columns={columns} pagination={false} loading={loading} />
      </div>
      <Divider />
      {!_isEmpty(props.students) ? (<Pagination {...paginationConfig} onChange={handleResidentPage} />): ""}
    </div>
  );
}



export default connect(
  mapStateToProps,
)(StudentTable);
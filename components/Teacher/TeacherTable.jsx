import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Typography, Divider, Pagination, Modal, Select, Input, Button } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import _isEmpty from 'lodash/isEmpty'
import API from '../../api'

const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

function mapStateToProps(state) {
  return {
    teachers: state.teacher.teachers,
    pagination: state.teacher.tablePagination,
    updatedTeacher: state.teacher.updatedTeacher,
  };
}
const handleClick = () => {}
const TeacherTable = (props) => {
  useEffect(() => {
    getTeachers();
  }, [props.updatedTeacher]);

  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({});
  const selectTeacher = (teacher) => {
    props.dispatch({
      type: "SELECT_TEACHER",
      data: teacher
    });
  }
  const deleteTeacher = (teacher) => {
    confirm({
      title: 'Do you Want to delete this teacher?',
      icon: <ExclamationCircleOutlined />,
      content: 'This will permanently delete this teacher and all its records.',
      onOk() {
        API.Teacher.delete(teacher.id)
        .then((res) => getTeachers(1))
        .catch((res) => getTeachers(1))
        .then((res) => getTeachers(1))
      },
      onCancel() {},
    });
  }
  const handleResidentPage = (val) => {
    getTeachers(val);
  }
  const getTeachers = (page = 1) => {
    setLoading(true);
    let filterOptions = {
      page: page,
      ...searchData
    }
    API.Teacher.all(filterOptions)
    .then((res) => {
      let result = res.data.teachers.data;
      let resultPagination = res.data.teachers.meta.pagination;
      result.map((item, index) => {
        item.key = `teachers_${index}`;
        return item;
      });
      setLoading(false);
      props.dispatch({
        type: "SET_TEACHERS",
        data: result
      })
      props.dispatch({
        type: "SET_TEACHERS_PAGINATION",
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
  const dataSource = props.teachers;
  const columns = [
    {
      title: 'ID Number',
      dataIndex: 'teacher_id_number',
      key: 'teacher_id_number',
    },
    {
      title: 'Full Name',
      dataIndex: 'full_name_last',
      key: 'full_name_last',
    },
    {
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="#!" onClick={() => {selectTeacher(record)} }>Edit</a>
          &nbsp;|&nbsp;
          <a href="#!" onClick={() => {deleteTeacher(record)} }>Delete</a>
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
        onSearch={() => {getTeachers()}}
      />

      <Divider />
      <div className="table-responsive">
        <Table dataSource={dataSource} columns={columns} pagination={false} loading={loading} />
      </div>
      <Divider />
      {!_isEmpty(props.teachers) ? (<Pagination {...paginationConfig} onChange={handleResidentPage} />): ""}
    </div>
  );
}



export default connect(
  mapStateToProps,
)(TeacherTable);
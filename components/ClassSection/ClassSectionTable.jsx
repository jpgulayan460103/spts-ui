import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Typography, Divider, Pagination, Modal, Select, Input, Button } from 'antd';
import _isEmpty from 'lodash/isEmpty'
import API from '../../api'

function mapStateToProps(state) {
  return {
    students: state.classSection.students,
    pagination: state.classSection.tablePagination,
    searchData: state.classSection.searchData,
    classSections: state.classSection.classSections,
    classSection: state.classSection.classSection,
  };
}
const handleClick = () => {}
const ClassSectionTable = (props) => {
  useEffect(() => {
    getClassSections();
  }, [props.classSection]);

  const [loading, setLoading] = useState(false);

  const handleResidentPage = (val) => {
    getClassSections(val);
  }
  const getClassSections = (page = 1) => {
    setLoading(true);
    let filterOptions = {
      page: page,
      ...props.searchData
    }
    API.ClassSection.all(filterOptions)
    .then((res) => {
      let result = res.data.class_sections.data;
      let resultPagination = res.data.class_sections.meta.pagination;
      console.log(result);
      
      setLoading(false);
      props.dispatch({
        type: "SET_CLASS_SECTIONS",
        data: result
      })
      props.dispatch({
        type: "SET_CLASS_SECTIONS_PAGINATION",
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
  
  const dataSource = props.classSections;
  const columns = [
    {
      title: 'Section',
      dataIndex: 'section_name',
      key: 'section_name',
    },
    {
      title: 'Grade Level',
      dataIndex: 'grade_level',
      key: 'grade_level',
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
)(ClassSectionTable);
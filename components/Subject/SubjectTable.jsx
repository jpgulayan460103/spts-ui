import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Typography, Divider, Pagination, Modal, Select, Input, Button } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import _isEmpty from 'lodash/isEmpty'
import _forEach from 'lodash/forEach'
import API from '../../api'
const { Search } = Input;
const { Option } = Select;

function mapStateToProps(state) {
  return {
    subjects: state.subject.subjects,
    pagination: state.subject.tablePagination,
    searchData: state.subject.searchData,
    updatedSubject: state.subject.updatedSubject,
    tracks: state.appDefault.tracks,
    semesters: state.appDefault.semesters,
  };
}
const handleClick = () => {}
const SubjectTable = (props) => {
  useEffect(() => {
    getSubjects();
  }, [props.updatedSubject]);

  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({});
  const setSearchString = (e) => {
    let string = e.target.value;
    setSearchData({...searchData,query:string});
  }
  const setTrackFilter = (value) => {
    setSearchData({...searchData,track_id:value});
  }
  const setSemesterFilter = (value) => {
    setSearchData({...searchData,semester_id:value});
  }
  const setGradeLevelFilter = (value) => {
    setSearchData({...searchData,grade_level:value});
  }
  const populateTrackSelection = (section) => {
    let items = [];
    _forEach(section, function(value, key) {
      items.push(<Option value={value.id} key={value.id} >{value.name}</Option>);   
    });
    return items;
  }
  const populateSemesterSelection = (section) => {
    let items = [];
    _forEach(section, function(value, key) {
      items.push(<Option value={value.id} key={value.id} >{value.name}</Option>);   
    });
    return items;
  }
  const selectSubject = (subject) => {
    props.dispatch({
      type: "SELECT_SUBJECT",
      data: subject
    });
  }
  const deleteSubject = (subject) => {
    API.Subject.delete(subject.id)
    .then((res) => {
      getSubjects(1);
    })
  }
  const handleResidentPage = (val) => {
    getSubjects(val);
  }
  const getSubjects = (page = 1) => {
    setLoading(true);
    let filterOptions = {
      page: page,
      ...searchData
    }
    API.Subject.all(filterOptions)
    .then((res) => {
      let result = res.data.subjects.data;
      let resultPagination = res.data.subjects.meta.pagination;
      setLoading(false);
      props.dispatch({
        type: "SET_SUBJECTS",
        data: result
      })
      props.dispatch({
        type: "SET_SUBJECTS_PAGINATION",
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
  
  const dataSource = props.subjects;
  const columns = [
    {
      title: 'Track',
      key: 'track',
      render: (text, record) => (
        <span>
          {`${record.track.name}`}
        </span>
      ),
    },
    {
      title: 'Subject Category',
      key: 'subject_category',
      render: (text, record) => (
        <span>
          {`${record.subject_category.name}`}
        </span>
      ),
    },
    {
      title: 'Subject Code',
      dataIndex: 'subject_code',
      key: 'subject_code',
    },
    {
      title: 'Subject Description',
      dataIndex: 'subject_description',
      key: 'subject_description',
    },
    {
      title: 'Grade Level',
      dataIndex: 'grade_level',
      key: 'grade level',
    },
    {
      title: 'Semester',
      key: 'semester',
      render: (text, record) => (
        <span>
          {`${record.semester.name}`}
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a onClick={() => {selectSubject(record)} }>Edit</a>
          {/* &nbsp;|&nbsp; */}
          {/* <a onClick={() => {deleteSubject(record)} }>Delete</a> */}
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
        onSearch={() => {getSubjects()}}
      />
      <Select
        allowClear
        placeholder="Select a Grade Level"
        onChange={setGradeLevelFilter}
        style={{ width: 200 }}
      >
        <Option value="11">11</Option>
        <Option value="12">12</Option>
      </Select>
      <Select
        allowClear
        style={{ minWidth: 200 }}
        placeholder="Select a Semester"
        optionFilterProp="children"
        onChange={setSemesterFilter}
      >
        {populateSemesterSelection(props.semesters)}
      </Select>
      <Select
        allowClear
        style={{ minWidth: 200 }}
        placeholder="Select a Track"
        optionFilterProp="children"
        onChange={setTrackFilter}
      >
        {populateTrackSelection(props.tracks)}
      </Select>
      <Button type="primary" icon={<SearchOutlined />} onClick={() => {getSubjects()}}>
        Search
      </Button>
      <Divider />
      <div className="table-responsive">
        <Table dataSource={dataSource} columns={columns} pagination={false} loading={loading} />
      </div>
      <Divider />
      {!_isEmpty(props.subjects) ? (<Pagination {...paginationConfig} onChange={handleResidentPage} />): ""}
    </div>
  );
}



export default connect(
  mapStateToProps,
)(SubjectTable);
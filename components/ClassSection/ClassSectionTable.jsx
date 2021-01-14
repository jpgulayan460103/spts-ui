import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Typography, Divider, Pagination, Modal, Select, Input, Button } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import _isEmpty from 'lodash/isEmpty'
import _forEach from 'lodash/forEach'
import API from '../../api'
const { Search } = Input;
const { Option } = Select;
const { confirm } = Modal;

function mapStateToProps(state) {
  return {
    students: state.classSection.students,
    pagination: state.classSection.tablePagination,
    searchData: state.classSection.searchData,
    classSections: state.classSection.classSections,
    updatedClassSection: state.classSection.updatedClassSection,
    selectedClassSection: state.classSection.selectedClassSection,
    tracks: state.appDefault.tracks,
  };
}
const handleClick = () => {}
const ClassSectionTable = (props) => {
  useEffect(() => {
    getClassSections();
  }, [props.updatedClassSection]);

  const [loading, setLoading] = useState(false);
  const [searchData, setSearchData] = useState({});
  const setSearchString = (e) => {
    let string = e.target.value;
    setSearchData({...searchData,query:string});
  }
  const setTrackFilter = (value) => {
    setSearchData({...searchData,track_id:value});
  }
  const setGradeLevelFilter = (value) => {
    setSearchData({...searchData,grade_level:value});
  }
  const setSchoolYearFilter = (value) => {
    setSearchData({...searchData,school_year:value});
  }
  const populateTrackSelection = (section) => {
    let items = [];
    _forEach(section, function(value, key) {
      items.push(<Option value={value.id} key={value.id} >{value.name}</Option>);   
    });
    return items;
  }
  const selectClassSection = (classSection, type="class-section") => {
    props.dispatch({
      type: "SET_CLASS_SECTION_FORM_TYPE",
      data: type
    });
    props.dispatch({
      type: "SELECT_CLASS_SECTION",
      data: classSection
    });
  }
  const deleteClassSection = (classSection) => {
    confirm({
      title: 'Do you Want to delete this class?',
      icon: <ExclamationCircleOutlined />,
      content: 'This will permanently delete this class and all its records.',
      onOk() {
        API.ClassSection.delete(classSection.id)
        .then((res) => getClassSections(1))
        .catch((res) => getClassSections(1))
        .then((res) => getClassSections(1))
      },
      onCancel() {},
    });
  }
  const handleResidentPage = (val) => {
    getClassSections(val);
  }
  const getClassSections = (page = 1) => {
    setLoading(true);
    let filterOptions = {
      page: page,
      ...searchData
    }
    API.ClassSection.all(filterOptions)
    .then((res) => {
      let result = res.data.class_sections.data;
      let resultPagination = res.data.class_sections.meta.pagination;
      result.map((item, index) => {
        item.key = `class_section_${index}`;
        return item;
      });
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
      title: 'Strand',
      key: 'track',
      render: (text, record) => (
        <span>
          {`${record.track.name}`}
        </span>
      ),
    },
    {
      title: 'Grade Level',
      dataIndex: 'grade_level',
      key: 'grade_level',
    },
    {
      title: 'School Year',
      dataIndex: 'school_year',
      key: 'school_year',
    },
    {
      title: 'Adviser',
      key: 'section_adviser',
      render: (text, record) => (
        <span>
          { record.teacher_id ? record.teacher.full_name_last : "" }
        </span>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      align: "center",
      render: (text, record) => (
        <span>
          <a href="#!" onClick={() => {selectClassSection(record, "student")} }>View Students</a><br />
          <a href="#!" onClick={() => {selectClassSection(record, "class-section")} }>Edit</a><br />
          <a href="#!" onClick={() => {deleteClassSection(record)} }>Delete</a>
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
        onSearch={() => {getClassSections()}}
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
        placeholder="Select a School Year"
        onChange={setSchoolYearFilter}
        style={{ width: 200 }}
      >
        <Option value="2020-2021">2020-2021</Option>
        <Option value="2021-2022">2021-2022</Option>
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
      <Button type="primary" icon={<SearchOutlined />} onClick={() => {getClassSections()}}>
        Search
      </Button>
      <Divider />
      <div className="table-responsive">
        <Table dataSource={dataSource} columns={columns} pagination={false} loading={loading} />
      </div>
      <Divider />
      {!_isEmpty(props.classSections) ? (<Pagination {...paginationConfig} onChange={handleResidentPage} />): ""}
    </div>
  );
}



export default connect(
  mapStateToProps,
)(ClassSectionTable);
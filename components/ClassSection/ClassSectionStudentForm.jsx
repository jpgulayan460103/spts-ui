import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Form, Input, Button, Divider, Select, DatePicker, Typography } from 'antd';
import { ExclamationCircleOutlined, SearchOutlined } from '@ant-design/icons';
import API from '../../api'
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'
import Highlighter from 'react-highlight-words';
import moment from 'moment';
import queryString from "query-string";
import Swal from 'sweetalert2/dist/sweetalert2.js'

const { Option } = Select;

function mapStateToProps(state) {
  return {
    formError: state.classSection.formError,
    selectedClassSection: state.classSection.selectedClassSection,
    tracks: state.appDefault.tracks,
    students: state.classSection.students,
  };
}
const ClassSectionForm = (props) => {
  useEffect(() => {
    getStudents(props.selectedClassSection.id);
  }, []);

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");

  const getStudents = (id) => {
    setLoading(true);
    API.ClassSection.students(id)
    .then(res => {
      setLoading(false);
      let classSection = res.data.class_sections.students.data;
      classSection = classSection.map(x => x.student);
      props.dispatch({
        type: "SELECT_CLASS_SECTION_STUDENTS",
        data: classSection
      });
      
      // setStudents(res.data.class_sections.students.data);
    })
    .catch(res => {
      setLoading(false);
    })
    .then(res => {
      setLoading(false);
    })
    ;
  }

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex)
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search Full Name`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {

    },
    render: text =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text.toString()}
        />
      ) : (
        text
      ),
  });

  const dataSource = props.students;
  const columns = [
    {
      title: 'ID Number',
      key: 'student_id_number',
      dataIndex: 'student_id_number',
    },
    {
      title: 'Full Name',
      key: 'full_name_last',
      dataIndex: 'full_name_last',
      defaultSortOrder: 'descend',
      ...getColumnSearchProps('full_name_last'),
    },
    {
      title: 'Gender',
      key: 'gender',
      dataIndex: 'gender',
    },
  ];

  return (
    <div>
      <p>Section Name: <b>{props.selectedClassSection.section_name}</b></p>
      <p>Track: <b>{props.selectedClassSection.track.name}</b></p>
      <p>Adviser: <b>{props.selectedClassSection.section_adviser}</b></p>
      <p>Grade Level: <b>{props.selectedClassSection.grade_level}</b></p>
      <p>School Year: <b>{props.selectedClassSection.school_year}</b></p>

      <div className="table-responsive">
        <Table dataSource={dataSource} columns={columns} pagination={{position: "top"}}  loading={loading} />
      </div>

    </div>
  );
}



export default connect(
  mapStateToProps,
)(ClassSectionForm);
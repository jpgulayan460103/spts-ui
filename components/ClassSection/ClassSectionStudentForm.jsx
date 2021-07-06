import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Modal, Input, Button, Divider, Select, Spin, Typography, Tabs } from 'antd';
import { ArrowLeftOutlined, SearchOutlined, ExclamationCircleOutlined, SaveOutlined, CloseSquareOutlined } from '@ant-design/icons';
import ScoreItemsForm from './Subjects/ScoreItemsForm'
import Attendance from './Attendance'
import Unit from '../Unit/Unit'
import API from '../../api'
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'
import _cloneDeep from 'lodash/cloneDeep'
import Highlighter from 'react-highlight-words';
import Pluralize from 'react-pluralize'
import moment from 'moment';
import queryString from "query-string";
import Swal from 'sweetalert2/dist/sweetalert2.js'
import { values } from 'lodash';

const { Option } = Select;
const { Search } = Input;
const { confirm } = Modal;
const { TabPane } = Tabs;

function mapStateToProps(state) {
  return {
    formError: state.classSection.formError,
    selectedClassSection: state.classSection.selectedClassSection,
    tracks: state.appDefault.tracks,
    students: state.classSection.students,
    subjects: state.classSection.subjects,
    selectedSubject: state.classSection.selectedSubject,
  };
}
const ClassSectionForm = (props) => {
  useEffect(() => {
    getClassSection(props.selectedClassSection.id);
  }, []);

  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [value, setValue] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsStatistics, setStudentsStatistics] = useState({male: 0, female: 0, total: 0});
  const [units, setUnits] = useState([]);

  const backToClassSectionForm = () => {
    props.dispatch({
      type: "SET_CLASS_SECTION_FORM_TYPE",
      data: "class-section"
    });
    props.dispatch({
      type: "SELECT_CLASS_SECTION",
      data: {}
    });
    props.dispatch({
      type: "SELECT_CLASS_SECTION_STUDENTS",
      data: []
    });
    props.dispatch({
      type: "SELECT_CLASS_SECTION_SUBJECTS",
      data: []
    });
  }

  const getClassSection = (id) => {
    setLoading(true);
    API.ClassSection.get(id)
    .then(res => {
      setLoading(false);
      let classSection = res.data.class_sections.students.data;
      let subjects = res.data.class_sections.subjects.data;
      classSection.map((item, index) => {
        item.key = `classsection_${index}`;
        return item;
      });
      subjects.map((item, index) => {
        item.key = `students_${index}`;
        return item;
      });
      popuplateStudentTable(classSection);
      props.dispatch({
        type: "SELECT_CLASS_SECTION_SUBJECTS",
        data: subjects
      });
    })
    .catch(res => {
      setLoading(false);
    })
    .then(res => {
      setLoading(false);
    })
    ;
  }


  const removeStudent = (student) => {
    confirm({
      title: `Do you Want to remove ${student.full_name_last} from ${props.selectedClassSection.section_name}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This will permanently remove this student and delete all its records from the class.',
      onOk() {
        API.ClassSection.removeStudent(props.selectedClassSection.id, student.id)
        .then(res => {
          let classSection = res.data.class_sections.students.data;
          popuplateStudentTable(classSection)
        })
        .catch(res => {})
        .then(res => {})
      },
      onCancel() {

      },
    });
  }

  const fetchStudents = _debounce((value) => {
    setFetching(true);
    setStudents([]);
    let searchData = {
      query: value
    };
    API.Student.all(searchData)
    .then(res => {
      setStudents(res.data.students.data);
      setFetching(false);      
    })
    .catch(res => {
      setFetching(false);
    })
    .then(res => {
      setFetching(false);
    })
    ;
    
  }, 250)

  const handleChange = (value) => {
    let student_id = value[0].value;
    let class_section_id = props.selectedClassSection.id;
    let formData = {
      student_id: student_id,
      class_section_id: class_section_id
    }
    API.ClassSection.addStudent(class_section_id, formData)
    .then(res => {
      let classSection = res.data.class_sections.students.data;
      popuplateStudentTable(classSection)
      setStudents([]);
    })
    .catch(res => {
      setStudents([]);
    })
    .then(res => {
      setStudents([]);
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

  const getColumnSearchProps = (dataIndex, searchTitle) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`Search ${searchTitle}`}
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
  const popuplateStudentTable = (classSection) => {
    props.dispatch({
      type: "SELECT_CLASS_SECTION_STUDENTS",
      data: classSection
    });
    let femaleStudents = classSection.filter(word => word.gender == "FEMALE");
    let maleStudents = classSection.filter(word => word.gender == "MALE");
    setStudentsStatistics({
      female: femaleStudents.length,
      male: maleStudents.length,
      total: classSection.length
    });
  }

  const studentDataSource = props.students;
  const studentColumns = [
    {
      title: 'ID Number',
      key: 'student_id_number',
      dataIndex: 'student_id_number',
      ...getColumnSearchProps('student_id_number', 'student ID Number'),
    },
    {
      title: 'Full Name',
      key: 'full_name_last',
      dataIndex: 'full_name_last',
      defaultSortOrder: 'descend',
      ...getColumnSearchProps('full_name_last','full name'),
    },
    {
      title: 'Gender',
      key: 'gender',
      dataIndex: 'gender',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text, record) => (
        <span>
          <a href="#!" onClick={() => {removeStudent(record)} }>Remove from the class</a>
        </span>
      ),
    }
  ];

  const subjectDataSource = props.subjects;
  const subjectColumns = [
    {
      title: 'Category',
      key: 'category',
      render: (text, record) => (
        <span>
          {record.subject_category.name}
        </span>
      )
    },
    {
      title: 'Subject Description',
      key: 'subject_description',
      dataIndex: 'subject_description',
    },
    {
      title: 'Action',
      key: 'action',
      align: "center",
      render: (text, record) => (
        <span>
          <a href="#!" onClick={() => {viewGradeItem(record)} }>Manage</a>
        </span>
      )
    },
  ];

  const changeTabs = (value) => {
    if(value.search("subject_") == 0){
      let valueSplit = value.split("_");
      let id = valueSplit[1];
      
      let selectedSubject = props.subjects.filter(item => item.id == id);
      props.dispatch({
        type: "SELECT_CLASS_SECTION_SUBJECT",
        data: selectedSubject[0],
      });
      getUnits(selectedSubject[0]);
    }
    setActivePane(value);
  }

  const [panes, setPanes] = useState([]);
  const [activePane, setActivePane] = useState("students");

  const onEdit = (targetKey, action) => {
    if(action == "remove"){
      removeTab(targetKey);
    }else{
      addTab();
    }
  };

  const removeTab = targetKey => {
    let removedPaneIndex = panes.findIndex(x => x.key === targetKey);
    panes.splice(removedPaneIndex, 1);
    setPanes([...panes]);
    if(removedPaneIndex <= 0){
      setActivePane("subjects");
    }else{
      let toPane = panes[removedPaneIndex-1].key;
      let valueSplit = toPane.split("_");
      let id = valueSplit[1];
      let selectedSubject = props.subjects.filter(item => item.id == id);
      props.dispatch({
        type: "SELECT_CLASS_SECTION_SUBJECT",
        data: selectedSubject[0],
      });
      setActivePane(panes[removedPaneIndex-1].key);
    }
  };
  const addTab = () => {
    setPanes([...panes]);
  };
  const viewGradeItem = (selectedSubject) => {
    let key = `subject_${selectedSubject.id}`;
    let filteredPane = panes.filter(pane => pane.key == key);
    if(_isEmpty(filteredPane)){
      panes.push({
        title: `Subject - ${selectedSubject.subject_description}`,
        content: 'New Tab Pane',
        key: key,
        data: selectedSubject, 
      });
      setActivePane(key);
      setPanes([...panes]);
    }else{
      setActivePane(key);
    }
    props.dispatch({
      type: "SELECT_CLASS_SECTION_SUBJECT",
      data: selectedSubject,
    });
    getUnits(selectedSubject);
  }

  

  const changeCategoryTabs = (value) => {
    getUnits(props.selectedSubject);
    // if(value == "category-1"){
    // }
  }

  const getUnits = (selectedSubject) => {
    let formData = {
      class_section_id: props.selectedClassSection.id,
      subject_id: selectedSubject.id
    };
    API.Unit.all(formData)
      .then(res => {
        let result = res.data.units;
        result.map((item, index) => {
          item.key = `unit_${index}`;
          return item;
        });
        setUnits(result);
        // console.log(result);
      })
      .catch(err => {
        console.log(err);
      })
      .then(res => {})
      ;
  }



  return (
    <div>
      <p>
        <a href="#!" onClick={() => backToClassSectionForm()}>
          <ArrowLeftOutlined /> Back to list of sections
        </a>
      </p>
      <p>Section Name: <b>{props.selectedClassSection.section_name}</b></p>
      <p>Track: <b>{props.selectedClassSection.track.name}</b></p>
      <p>Adviser: <b>{props.selectedClassSection.section_adviser}</b></p>
      <p>
        Total Students: <b>{studentsStatistics.total}</b>&nbsp;
        (
          <Pluralize singular={'Male'} count={studentsStatistics.male} zero={'0 Male'}/>,&nbsp;
          <Pluralize singular={'Female'} count={studentsStatistics.female} zero={'0 Female'} />
        )
        </p>
      <p>Grade Level: <b>{props.selectedClassSection.grade_level}</b></p>
      <p>School Year: <b>{props.selectedClassSection.school_year}</b></p>
      <Tabs onChange={changeTabs} type="editable-card" activeKey={activePane} onEdit={onEdit}>
        <TabPane tab="Students" key="students" closable={false}>
          <div>
            <b>Add Students:</b><br />
            <Select
              mode="multiple"
              labelInValue
              value={value}
              placeholder="Search and select student"
              notFoundContent={fetching ? <Spin size="small" /> : null}
              filterOption={false}
              onSearch={fetchStudents}
              onChange={handleChange}
              style={{ width: 300 }}
            >
              {students.map(d => (
                <Option key={d.id}>{d.full_name_last}</Option>
              ))}
            </Select>
          </div>
          <div className="table-responsive">
            <Table dataSource={studentDataSource} columns={studentColumns}  loading={loading} />
          </div>
        </TabPane>
        <TabPane tab="Subjects" key="subjects" closable={false}>
          <div className="table-responsive">
            <Table dataSource={subjectDataSource} columns={subjectColumns}  loading={loading} />
          </div>
        </TabPane>
        {panes.map(pane => (
          <TabPane tab={pane.title} key={pane.key} closable={true}>
            {/* <ScoreItemsForm subject={pane.data} /> */}

            <Tabs defaultActiveKey="category-2" type="card" onChange={changeCategoryTabs}>
              <TabPane tab="Workspace" key="category-1">
                <Tabs type="card">
                  {
                    units.map(unit => (
                      <TabPane tab={unit.unit_name} key={unit.key}>
                        <ScoreItemsForm subject={pane.data} unitId={unit.id} />
                      </TabPane>
                    ) )
                  }
                </Tabs>
              </TabPane>


              

              <TabPane tab="Attendance" key="category-3">
                <Attendance subject={pane.data} />
              </TabPane>


              <TabPane tab="Configurations" key="category-2">
                <Tabs defaultActiveKey="config-1" type="card">
                  <TabPane tab="Units" key="config-1">
                    <Unit {...props} units={units} getUnits={getUnits} loading={loading} />
                  </TabPane>
                  <TabPane tab="Attendance" key="config-2">
                    <Attendance subject={pane.data} />
                  </TabPane>
                </Tabs>
              </TabPane>
              
            </Tabs>
          </TabPane>
        ))}
      </Tabs>

    </div>
  );
}



export default connect(
  mapStateToProps,
)(ClassSectionForm);
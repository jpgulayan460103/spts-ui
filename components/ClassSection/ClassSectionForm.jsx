import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Divider, Select, DatePicker, Typography } from 'antd';
import API from '../../api'
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'
import moment from 'moment';
import queryString from "query-string";
import Swal from 'sweetalert2/dist/sweetalert2.js'

const { Option } = Select;

function mapStateToProps(state) {
  return {
    formError: state.classSection.formError,
    selectedClassSection: state.classSection.selectedClassSection,
    tracks: state.appDefault.tracks,
    semesters: state.appDefault.semesters,
    quarters: state.appDefault.quarters,
    teachers: state.appDefault.teachers,
  };
}
const handleClick = () => {}
const layout = {
  labelCol: { span: 24 },
  wrapperCol: { span: 24 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const ClassSectionForm = (props) => {
  useEffect(() => {
    _isEmpty(props.tracks) ? getTracks() : null;
    _isEmpty(props.teachers) ? getTeachers() : null;
    _isEmpty(props.quarters) ? getQuarters() : null;
    _isEmpty(props.semesters) ? getSemesters() : null;
  }, []);
  useEffect(() => {
    if(!_isEmpty(props.selectedClassSection)){
      setFormData({
        ...props.selectedClassSection
      })
      formRef.current.setFieldsValue({
        ...props.selectedClassSection
      });
      setFormType("update");
    }
  }, [props.selectedClassSection]);

  const formRef = React.useRef();
  const [formType, setFormType] = useState("create");
  const [submit, setSubmit] = useState(false);
  const [formData, setFormData] = useState({});

  const getTracks = () => {
    API.Track.all().then(res => {
      props.dispatch({
        type: "SET_TRACKS",
        data: res.data.tracks.data
      });
    });
  }
  const getQuarters = () => {
    API.Quarter.all().then(res => {
      props.dispatch({
        type: "SET_QUARTERS",
        data: res.data.quarters.data
      });
    });
  }
  const getSemesters = () => {
    API.Semester.all().then(res => {
      props.dispatch({
        type: "SET_SEMESTERS",
        data: res.data.semesters.data
      });
    });
  }
  const getTeachers = () => {
    API.Teacher.all({getall: 1}).then(res => {
      props.dispatch({
        type: "SET_ALL_TEACHERS",
        data: res.data.teachers.data
      });
    });
  }

  const populateTrackSelection = (section) => {
    let items = [];
    _forEach(section, function(value, key) {
      items.push(<Option value={value.id} key={value.id} >{value.name}</Option>);   
    });
    return items;
  }

  const populateQuarterSelection = (section) => {
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
  
  const displayErrors = (field) => {
    if(props.formError[field]){
      return {
        validateStatus: 'error',
        help: props.formError[field][0]
      }
    }
  }
  const formSubmit = _debounce(() => {

    if(formType == "create"){
      addClassSection();
    }else{
      updateClassSection();
    }
  },250);
  const addClassSection = () => {
    API.ClassSection.add(formData)
    .then(res => {
      props.dispatch({
        type: "UPDATE_CLASS_SECTION",
        data: res.data.class_sections,
      })
      resetForm();
    })
    .catch(res => {
      if(res.response && res.response.data){
        props.dispatch({
          type: "CLASS_SECTION_FORM_ERROR",
          data: res.response.data.errors
        })
      }
    })
    .then(res => {})
    ;
  }
  const updateClassSection = () => {
    API.ClassSection.update(formData,formData.id)
    .then(res => {
      props.dispatch({
        type: "UPDATE_CLASS_SECTION",
        data: res.data.class_sections,
      })
      resetForm();
    })
    .catch(res => {
      if(res.response && res.response.data){
        props.dispatch({
          type: "CLASS_SECTION_FORM_ERROR",
          data: res.response.data.errors
        })
      }
    })
    .then(res => {})
    ;
  }
  const resetForm = () => {
    formRef.current.resetFields();
    setFormData({});
    setFormType("create");
    props.dispatch({
      type: "SELECT_CLASS_SECTION",
      data: {}
    });
    props.dispatch({
      type: "CLASS_SECTION_FORM_ERROR",
      data: {}
    });
  }
  const setFormFields = (e) => {
    let transformedValue = {};
    _forEach(e, function(value, key) {
      if(typeof value == "string"){
        transformedValue[key] = value.toUpperCase();
      }else{
        transformedValue[key] = value;
      }
    });
    setFormData({
      ...formData,
      ...transformedValue
    })
  }
  const populateTeacherSelection = (teachers) => {
    let items = [];
    _forEach(teachers, function(value, key) {
      items.push(<Option value={value.id} key={value.id} >{value.full_name_last}</Option>);   
    });
    return items;
  }
  return (
    <div>
      <Form {...layout} ref={formRef} layout="vertical" name="basic" onValuesChange={setFormFields} onFinish={formSubmit} >
        <Form.Item label="Section Name" name="section_name" hasFeedback {...displayErrors('section_name')} rules={[{ required: true, message: 'The section name number field is required.' }]} >
          <Input autoComplete="off" placeholder="Enter Section Name" />
        </Form.Item>
        <Form.Item label="Track" name="track_id" hasFeedback {...displayErrors('track_id')}  rules={[{ required: true, message: 'Please select track' }]} >
          <Select
            showSearch
            placeholder="Select a Track"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {populateTrackSelection(props.tracks)}
          </Select>
        </Form.Item>
        <Form.Item label="Quarter" name="quarter_id" hasFeedback {...displayErrors('quarter_id')}  rules={[{ required: true, message: 'Please select quarter' }]} >
          <Select
            showSearch
            placeholder="Select a quarter"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {populateQuarterSelection(props.quarters)}
          </Select>
        </Form.Item>
        <Form.Item label="Semester" name="semester_id" hasFeedback {...displayErrors('semester_id')}  rules={[{ required: true, message: 'Please select semester' }]} >
          <Select
            showSearch
            placeholder="Select a semester"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {populateSemesterSelection(props.semesters)}
          </Select>
        </Form.Item>
        <Form.Item label="Section Adviser" name="teacher_id" hasFeedback {...displayErrors('teacher_id')} rules={[{ required: true, message: 'The section adviser number field is required.' }]} >
          <Select
            showSearch
            allowClear
            style={{ width: "100%" }}
            placeholder="Select a Adviser"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {populateTeacherSelection(props.teachers)}
          </Select>
        </Form.Item>
        <Form.Item label="Grade Level" name="grade_level" hasFeedback {...displayErrors('grade_level')}  rules={[{ required: true, message: 'The grade level number field is required.' }]} >
          <Select placeholder="Select a Grade Level">
            <Option value="11">11</Option>
            <Option value="12">12</Option>
          </Select>
        </Form.Item>
        <Form.Item label="School Year" name="school_year" hasFeedback {...displayErrors('school_year')}  rules={[{ required: true, message: 'The school year number field is required.' }]} >
          <Select placeholder="Select a School Year">
            <Option value="2020-2021">2020-2021</Option>
            <Option value="2021-2022">2021-2022</Option>
          </Select>
        </Form.Item>

        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" disabled={submit} loading={submit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(ClassSectionForm);
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
    formError: state.subject.formError,
    tracks: state.appDefault.tracks,
    quarters: state.appDefault.quarters,
    semesters: state.appDefault.semesters,
    selectedSubject: state.subject.selectedSubject,
  };
}
const handleClick = () => {}
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { offset: 8, span: 16 },
};
const SubjectForm = (props) => {
  useEffect(() => {
    _isEmpty(props.tracks) ? getTracks() : null;
    _isEmpty(props.quarters) ? getQuarters() : null;
    _isEmpty(props.semesters) ? getSemesters() : null;
    getTeachers();
  }, []);
  useEffect(() => {
    if(!_isEmpty(props.selectedSubject)){
      setFormData({
        ...props.selectedSubject
      })
      formRef.current.setFieldsValue({
        ...props.selectedSubject
      });
      setFormType("update");
    }
  }, [props.selectedSubject]);
  const formRef = React.useRef();
  const [submit, setSubmit] = useState(false);
  const [formType, setFormType] = useState("create");
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
    API.Teacher.all().then(res => {
      props.dispatch({
        type: "SET_TEACHERS",
        data: res.data.teachers.data
      });
    });
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
      addSubject();
    }else{
      updateSubject();
    }
  },250);

  const addSubject = () => {
    API.Subject.add(formData)
    .then(res => {
      props.dispatch({
        type: "UPDATE_SUBJECT",
        data: res.data.subjects,
      });
      resetForm();
    })
    .catch(res => {
      if(res.response && res.response.data){
        props.dispatch({
          type: "SUBJECT_FORM_ERROR",
          data: res.response.data.errors
        })
      }
    })
    .then(res => {})
    ;
  }
  const updateSubject = () => {
    API.Subject.update(formData,formData.id)
    .then(res => {
      props.dispatch({
        type: "UPDATE_SUBJECT",
        data: res.data.subjects,
      });
      resetForm();
    })
    .catch(res => {
      if(res.response && res.response.data){
        props.dispatch({
          type: "SUBJECT_FORM_ERROR",
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
      type: "SELECT_SUBJECT",
      data: {}
    });
    props.dispatch({
      type: "SUBJECT_FORM_ERROR",
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
  return (
    <div>
      <Form {...layout} ref={formRef} layout="horizontal" name="basic" onValuesChange={setFormFields} onFinish={formSubmit} >
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
        <Form.Item label="Subject ID Number" name="student_id_number" hasFeedback {...displayErrors('student_id_number')} rules={[{ required: true, message: 'The subject id number field is required.' }]} >
          <Input autoComplete="off" placeholder="Enter Subject ID Number" />
        </Form.Item>
        <Form.Item label="Last Name" name="last_name" hasFeedback {...displayErrors('last_name')} rules={[{ required: true, message: 'The last name field is required.' }]} >
          <Input autoComplete="off" placeholder="Enter Last Name" />
        </Form.Item>
        <Form.Item label="First Name" name="first_name" hasFeedback {...displayErrors('first_name')}  rules={[{ required: true, message: 'The first name field is required.' }]} >
          <Input autoComplete="off" placeholder="Enter First Name" />
        </Form.Item>
        <Form.Item label="Middle Name" name="middle_name" hasFeedback {...displayErrors('middle_name')}>
          <Input autoComplete="off" placeholder="Enter Middle Name" />
        </Form.Item>
        <Form.Item label="Ext Name" name="ext_name" hasFeedback {...displayErrors('ext_name')}>
          <Input autoComplete="off" placeholder="Enter Ext Name" />
        </Form.Item>
        <Form.Item label="Gender" name="gender" hasFeedback {...displayErrors('gender')}>
          <Select placeholder="Select a Gender">
            <Option value="MALE">MALE</Option>
            <Option value="FEMALE">FEMALE</Option>
          </Select>
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" disabled={submit} loading={submit}>
            Submit
          </Button>
          <Button type="danger" onClick={resetForm}>
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(SubjectForm);
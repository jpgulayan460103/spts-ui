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
    formError: state.student.formError,
    class_sections: state.student.class_sections,
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
const StudentForm = (props) => {
  useEffect(() => {
    getClassSection();
  }, []);
  const formRef = React.useRef();
  const [submit, setSubmit] = useState(false);
  const [formData, setFormData] = useState({});

  const getClassSection = () => {
    let options = {dropdown:true};
    API.ClassSection.all(options)
    .then(res => {
      props.dispatch({
        type: "SET_CLASS_SECTION",
        data: res.data.class_sections.data
      });
    })
    .catch(res => {})
    .then(res => {})
    ;
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
    API.Student.add(formData)
    .then(res => {
      props.dispatch({
        type: "SET_STUDENT",
        data: res.data.students,
      });
    })
    .catch(res => {
      props.dispatch({
        type: "STUDENT_FORM_ERROR",
        data: res.response.data.errors
      })
    })
    .then(res => {})
    ;
  },250);
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

  const populateClassSectionSelection = (section) => {
    let items = [];
    _forEach(section, function(value, key) {
      items.push(<Option value={value.id} key={value.id} >{value.section_name}</Option>);   
    });
    return items;
  }
  return (
    <div>
      <Form {...layout} ref={formRef} layout="horizontal" name="basic" onValuesChange={setFormFields} onFinish={formSubmit} >
      <Form.Item label="Class Section" name="class_section_id" hasFeedback {...displayErrors('class_section_id')}  rules={[{ required: true, message: 'Please select class section' }]} >
        <Select
          showSearch
          placeholder="Select a Class Section"
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          {populateClassSectionSelection(props.class_sections)}
        </Select>
      </Form.Item>
        <Form.Item label="Student ID Number" name="student_id_number" hasFeedback {...displayErrors('student_id_number')} rules={[{ required: true, message: 'The student id number field is required.' }]} >
          <Input autoComplete="off" placeholder="Enter Student ID Number" />
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
          <Button type="primary" htmlType="submit" disabled={submit}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(StudentForm);
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
    formError: state.classSection.formError
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
const ClassSectionForm = (props) => {
  useEffect(() => {

  }, []);
  const formRef = React.useRef();
  const [submit, setSubmit] = useState(false);
  const [formData, setFormData] = useState({});
  
  const displayErrors = (field) => {
    if(props.formError[field]){
      return {
        validateStatus: 'error',
        help: props.formError[field][0]
      }
    }
  }
  const formSubmit = _debounce(() => {
    API.ClassSection.add(formData)
    .then(res => {
      props.dispatch({
        type: "SET_CLASS_SECTION",
        data: res.data.class_sections,
      })
    })
    .catch(res => {
      props.dispatch({
        type: "CLASS_SECTION_FORM_ERROR",
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
  return (
    <div>
      <Form {...layout} ref={formRef} layout="horizontal" name="basic" onValuesChange={setFormFields} onFinish={formSubmit} >
        <Form.Item label="Section Name" name="section_name" hasFeedback {...displayErrors('section_name')} rules={[{ required: true, message: 'The section name number field is required.' }]} >
          <Input autoComplete="off" placeholder="Enter Section Name" />
        </Form.Item>
        <Form.Item label="Section Strand" name="section_strand" hasFeedback {...displayErrors('section_strand')} rules={[{ required: true, message: 'The section strand number field is required.' }]} >
          <Input autoComplete="off" placeholder="Enter Section Strand" />
        </Form.Item>
        <Form.Item label="Section Adviser" name="section_adviser" hasFeedback {...displayErrors('section_adviser')} rules={[{ required: true, message: 'The section adviser number field is required.' }]} >
          <Input autoComplete="off" placeholder="Enter Section Adviser" />
        </Form.Item>
        <Form.Item label="Grade Level" name="grade_level" hasFeedback {...displayErrors('grade_level')} rules={[{ required: true, message: 'The grade level number field is required.' }]} >
          <Input autoComplete="off" placeholder="Enter Grade Level" />
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
)(ClassSectionForm);
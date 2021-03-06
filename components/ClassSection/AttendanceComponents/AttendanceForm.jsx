import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Divider, Select, DatePicker, Typography } from 'antd';
import { SaveOutlined, CloseSquareOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import API from '../../../api'
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'
import moment from 'moment';
import queryString from "query-string";
import Swal from 'sweetalert2/dist/sweetalert2.js'

function mapStateToProps(state) {
  return {
    formError: state.student.formError
  };
}
const handleClick = () => {}
const layout = {
  labelCol: { span: 16 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { span: 24 },
};
const AttendanceForm = (props) => {
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
    API.Student.add(formData)
    .then(res => {})
    .catch(res => {
      props.dispatch({
        type: "STUDENT_FORM_ERROR",
        data: res.response.data.errors
      })
    })
    .then(res => {})
    ;
  },150);
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
      <Form {...layout} ref={formRef} layout="vertical" name="basic" onValuesChange={setFormFields} onFinish={formSubmit} >
        <Form.Item label="Week Name" name="week_name" hasFeedback {...displayErrors('week_name')}>
          <Input autoComplete="off" placeholder="Enter Week Name" />
        </Form.Item>
        <Form.Item label="Number of Days" name="number_of_days" hasFeedback {...displayErrors('number_of_days')}>
          <Input autoComplete="off" placeholder="Enter Number of Days" />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" size="small" icon={<SaveOutlined />} htmlType="submit" disabled={submit} style={{ width: 90, marginRight: 8 }} >
            Save
          </Button>
          <Button type="danger" size="small" icon={<CloseSquareOutlined />} htmlType="submit" disabled={submit} style={{ width: 90, marginRight: 8 }} >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(AttendanceForm);
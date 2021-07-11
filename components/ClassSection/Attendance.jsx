import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Input, InputNumber, Button, Table, Select, DatePicker, Modal } from 'antd';
import { SaveOutlined, CloseSquareOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import API from './../../api'
import AttendanceForm from './AttendanceComponents/AttendanceForm'
import _forEach from 'lodash/forEach'

const { confirm } = Modal;

function mapStateToProps(state) {
  return {
    selectedSubject: state.classSection.selectedSubject,
    selectedClassSection: state.classSection.selectedClassSection,
  };
}

const layout = {
  labelCol: { span: 16 },
  wrapperCol: { span: 16 },
};
const tailLayout = {
  wrapperCol: { span: 24 },
};


const handleClick = () => {}
const Attendance = (props) => {
  useEffect(() => {
    console.log("added");
    return () => {
      
    };
  }, []);
  //states
  const [countTest, setCountTest] = useState(0);
  const formRef = React.useRef();
  const [submit, setSubmit] = useState(false);
  const [weekFormType, setWeekFormType] = useState("create");
  const [selectedWeek, setSelectedWeek] = useState({});
  const [formData, setFormData] = useState({
    class_section_id: props.selectedClassSection.id,
    subject_id: props.selectedSubject.id
  });

  //actions
  const setFormFields = (e) => {
    let transformedValue = {};
    _forEach(e, function(value, key) {
        transformedValue[key] = value;
    });
    setFormData({
      ...formData,
      ...transformedValue
    })
  }
  const formSubmit = (e) => {

    if(weekFormType == "create"){
      addWeek();
    }else{
      updateWeek();
    }
  }

  const addWeek = () => {
    API.Attendance.addWeek(formData)
    .then(res => {
      props.getAttendanceWeeks(props.selectedSubject);
    })
    .catch(err => {
      console.log(err);
    })
    .then(res => {})
    ;
  }
  const updateWeek = (e) => {
    API.Attendance.updateWeek(formData, selectedWeek.id)
    .then(res => {
      cancelEditWeek();
      props.getAttendanceWeeks(props.selectedSubject);
    })
    .catch(err => {
      console.log(err);
    })
    .then(res => {})
    ;
  }


  const confirmDeleteWeek = (week) => {
    console.log(week);
    confirm({
      title: `Do you want to remove ${week.unit_name}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This will permanently remove all data on this week.',
      onOk() {
        deleteWeek(week.id);
      },
      onCancel() {

      },
    });
  }

  const editWeek = (unit) => {
    setWeekFormType("update");
    setSelectedWeek(unit);
    formRef.current.setFieldsValue(unit);
    setFormData({
      ...formData,
      ...unit
    })
  }

  const cancelEditWeek = () => {
    setWeekFormType("create");
    setSelectedWeek({});
    formRef.current.resetFields();
  }

  const deleteWeek = (id) => {
    API.Attendance.deleteWeek(id)
    .then(res => {
      props.getAttendanceWeeks(props.selectedSubject);
    })
    .catch(err => {
      console.log(err);
    })
    .then(res => {})
    ;
  }


  //data
  const weekColumns = [
    {
      title: 'Week',
      key: 'week_name',
      render: (text, record) => (
        <span>
          { record.week_name }
        </span>
      )
    },
    {
      title: 'Days',
      key: 'number_of_days',
      render: (text, record) => (
        <span>
          { record.number_of_days }
        </span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      align: "center",
      render: (text, record) => (
        <span>
          <a href="#!" onClick={() => { editWeek(record)  } }>Edit</a> | <a href="#!" onClick={() => { confirmDeleteWeek(record) } }>Delete</a>
        </span>
      )
    },
  ];


  return (
    <div className="row">
      <div className="col-md-3">
        <Form {...layout} ref={formRef} layout="vertical" name="basic" onValuesChange={setFormFields} onFinish={formSubmit} >
          <Form.Item label="Week Name" name="week_name" rules={[{ required: true, message: 'Required' }]}>
            <Input autoComplete="off" placeholder="Enter Week Name" />
          </Form.Item>
          { weekFormType == "create" ? (
          <Form.Item label="Number of Days" name="number_of_days" rules={[{ required: true, message: 'Required' }]}>
            <InputNumber min={1} max={7} style={{width: "100%"}}  placeholder="Enter Number of Days" />
          </Form.Item>
          ) : "" }
          <Form.Item {...tailLayout}>
            <Button type="primary" htmlType="submit" size="small" icon={<SaveOutlined />} htmlType="submit" disabled={submit} style={{ width: 90, marginRight: 8 }} >
              Save
            </Button>
            { weekFormType == "update" ? (
            <Button type="danger" size="small" icon={<CloseSquareOutlined />} htmlType="submit" disabled={submit} style={{ width: 90, marginRight: 8 }} >
              Cancel
            </Button>
            ) : "" }
          </Form.Item>
        </Form>
      </div>
      <div className="col-md-9">
        <Table dataSource={props.attendanceWeeks} columns={weekColumns}  loading={props.loading} />
      </div>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(Attendance);
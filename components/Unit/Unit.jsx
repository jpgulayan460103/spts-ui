import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Table, Input, Button, Modal, Form } from 'antd';
import { SaveOutlined, CloseSquareOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

import API from '../../api'
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'
import _cloneDeep from 'lodash/cloneDeep'

const { confirm } = Modal;



function mapStateToProps(state) {
  return {
    
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
const Unit = (props) => {
  const formRef = React.useRef();
  const [unitTextbox, setUnitTextbox] = useState("");
  const [unitFormType, setUnitFormType] = useState("create");
  const [selectedUnit, setSelectedUnit] = useState([]);
  const [loading, setLoading] = useState(false);
  const submitUnitForm = () => {
    if(unitFormType == "create"){
      addUnit();
    }else{
      updateUnit();
    }
  }
  const addUnit = (e) => {
    // let name = e.target.value;
    let name = unitTextbox;
    let formData = {
      class_section_id: props.selectedClassSection.id, 
      subject_id: props.selectedSubject.id, 
      unit_name: name, 
    };
    API.Unit.add(formData)
    .then(res => {
      // console.log(res);
      props.getUnits(props.selectedSubject);
    })
    .catch(err => {
      console.log(err);
    })
    .then(res => {})
    ;
  }
  const updateUnit = (e) => {
    // let name = e.target.value;
    let name = unitTextbox;
    let formData = {
      unit_name: name, 
    };
    API.Unit.update(formData, selectedUnit.id)
    .then(res => {
      // console.log(res);
      cancelEditUnit();
      props.getUnits(props.selectedSubject);
    })
    .catch(err => {
      console.log(err);
    })
    .then(res => {})
    ;
  }

  const confirmDeleteUnit = (unit) => {
    console.log(unit);
    confirm({
      title: `Do you want to remove ${unit.unit_name}?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This will permanently remove all data on this unit.',
      onOk() {
        deleteUnit(unit.id);
      },
      onCancel() {

      },
    });
  }

  const editUnit = (unit) => {
    setUnitFormType("update");
    setUnitTextbox(unit.unit_name);
    setSelectedUnit(unit);
    formRef.current.setFieldsValue({
      unit_name: unit.unit_name
    });
  }

  const cancelEditUnit = () => {
    setUnitFormType("create");
    setUnitTextbox("");
    setSelectedUnit([]);
    formRef.current.resetFields();
  }

  const deleteUnit = (id) => {
    API.Unit.delete(id)
    .then(res => {
      props.getUnits(props.selectedSubject);
    })
    .catch(err => {
      console.log(err);
    })
    .then(res => {})
    ;
  }

  const unitColumns = [
    {
      title: 'Unit Name',
      key: 'unit_name',
      render: (text, record) => (
        <span>
          { record.unit_name }
        </span>
      )
    },
    {
      title: 'Subject Description',
      key: 'subject_description',
      render: (text, record) => (
        <span>
          { record.subject.subject_description }
        </span>
      )
    },
    {
      title: 'Action',
      key: 'action',
      align: "center",
      render: (text, record) => (
        <span>
          <a href="#!" onClick={() => { editUnit(record)  } }>Edit</a> | <a href="#!" onClick={() => { confirmDeleteUnit(record) } }>Delete</a>
        </span>
      )
    },
  ];
  return (
    <div className="row">
      <div className="col-md-2">

        <Form {...layout} ref={formRef} layout="vertical" name="basic" >
          <Form.Item label="Unit Name" name="unit_name">
              <Input
                placeholder={`Enter Unit Name`}
                onChange={(e) => { setUnitTextbox(e.target.value) } }
                value={unitTextbox}
              />
          </Form.Item>
          <Form.Item {...tailLayout}>
            <Button
              type="primary"
              onClick={() => submitUnitForm()}
              icon={<SaveOutlined />}
              size="small"
              style={{ width: 90, marginRight: 8 }}
            >
              Save
            </Button>

            { unitFormType == "update" ? (
              <Button
                type="danger"
                onClick={() => cancelEditUnit() }
                icon={<CloseSquareOutlined />}
                size="small"
                style={{ width: 90, marginRight: 8 }}
              >
                Cancel
              </Button>
            ) : "" }
          </Form.Item>
        </Form>


        

        
        
      </div>
      <div className="col-md-10">
        <Table dataSource={props.units} columns={unitColumns}  loading={props.loading} />
      </div>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(Unit);
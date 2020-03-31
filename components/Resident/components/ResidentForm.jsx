import React, { useState,useEffect} from 'react';
import { connect } from 'react-redux';
import Router, { useRouter } from 'next/router'
import { Form, Input, Button, Divider, Select, DatePicker, Typography } from 'antd';
import API from '../../../api'
import _forEach from 'lodash/forEach'
import _isEmpty from 'lodash/isEmpty'
import _debounce from 'lodash/debounce'
import moment from 'moment';
import queryString from "query-string";
import Swal from 'sweetalert2/dist/sweetalert2.js'

const { Title } = Typography;
const { Option } = Select;

function mapStateToProps(state) {
  return {
    formData: state.resident.formData,
    formError: state.resident.formError,
    barangay: state.resident.barangays,
  };
}

const ResidentForm = (props) => {
  const [formType, setformType] = useState("create");
  const [formData, setFormData] = useState({is_registered_voter:"YES"});
  const [submit, setSubmit] = useState(false);
  const formRef = React.useRef();
  const router = useRouter()
  router.query = queryString.parse(router.asPath.split(/\?/)[1]);
  const { id } = router.query
  
  useEffect(() => {
    getBarangay();
    if(id){
      setformType("update");
      getResident(id);
    }
  }, []);
  const getBarangay = () => {
    if(_isEmpty(props.barangay)){
      API.Resident.getBarangay()
      .then(res => {
        let barangayList = res.data.options[0].cities[0].barangays;
        props.dispatch({
          type: "SET_BARANGAY",
          data: barangayList
        })
      })
      .catch(err => {})
      .then(res => {});
    }
  }
  const getResident = (id) => {
    API.Resident.get(id)
    .then(res => {
      let resident = res.data.residents;
      resident.birth_date = moment(resident.birth_date, "MM-DD-YYYY");
      resident.voters_registration_date = moment(resident.voters_registration_date, "MM-DD-YYYY");
      setFormData({
        ...resident
      })
      formRef.current.setFieldsValue({
        ...resident
      });
    })
    .catch(err => {
      Swal.fire({
        title: 'Error',
        text: 'The system cannot find what you are looking for. It may not have existed or it has been removed.',
        icon: 'error',
        confirmButtonText: 'Back to Home',
        onClose: () => {
          Router.push('/')
        }
      })
    })
    .then(res => {
      // console.log(barangay);
    })
    ;
  }
  const onFinishFailed = (value) => {}
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const setFormFields = (e) => {
    setFormData({
      ...formData,
      ...e
    })
  }
  const formSubmit = _debounce(() => {
    setSubmit(true);
    props.dispatch({
      type: "RESIDENT_FORM_SUBMIT",
      data: {}
    })
    if(formType == "create"){
      API.Resident.add(formData)
      .then(res => {
        setSubmit(false);
        Swal.fire(
          'Success!',
          'You have successfuly added a resident',
          'success'
        )
        formRef.current.resetFields();
        setFormData({is_registered_voter:"YES"});
      })
      .catch(err => {
        setSubmit(false);
        console.log(err);
        
        if(err.response && err.response.data){
          props.dispatch({
            type: "RESIDENT_FORM_ERROR",
            data: err.response.data
          })
        }
        Swal.fire(
          'Update Failed!',
          `Please check for required fields`,
          'info'
        )
      })
      .then(res => {
        setSubmit(false);
      })
    }else{
      API.Resident.update(formData,id)
      .then(res => {
        setSubmit(false);
        Swal.fire(
          'Success!',
          `You have successfuly updated a resident <br> ${formData.full_name_last}`,
          'success'
        )
      })
      .catch(err => {
        setSubmit(false);
        if(err.response && err.response.data){
          props.dispatch({
            type: "RESIDENT_FORM_ERROR",
            data: err.response.data
          })
        }

        Swal.fire(
          'Update Failed!',
          `Please check for required fields`,
          'info'
        )
      })
      .then(res => {
        setSubmit(false);
      })
    }
  }, 250)
  const displayErrors = (field) => {
    if(props.formError[field]){
      return {
        validateStatus: 'error',
        help: props.formError[field][0]
      }
    }
  }
  const populateBarangaySelection = (barangay) => {
    let items = [];
    _forEach(barangay, function(value, key) {
      items.push(<Option value={value.id} key={value.id} >{value.name}</Option>);   
    });
    return items;
  }
  return (
    <div>
      <Title style={{textAlign: "center"}}>
        {(formType=="create" ? "ADD" : "EDIT")} RESIDENT
      </Title>
      <Divider />
      <Form {...layout} ref={formRef} layout="horizontal" name="basic" initialValues={{ is_registered_voter: 'YES' }} onValuesChange={setFormFields} onFinish={formSubmit} onFinishFailed={onFinishFailed}>
      <div className="row">
        <div className="col-md-6 col-lg-4">
            <Form.Item label="Last Name" name="last_name" hasFeedback {...displayErrors('last_name')}>
              <Input autoComplete="off" placeholder="Enter Last Name" />
            </Form.Item>
            <Form.Item label="First Name" name="first_name" hasFeedback {...displayErrors('first_name')}>
              <Input autoComplete="off" placeholder="Enter First Name" />
            </Form.Item>
            <Form.Item label="Middle Name" name="middle_name" hasFeedback {...displayErrors('middle_name')}>
              <Input autoComplete="off" placeholder="Enter Middle Name" />
            </Form.Item>
            <Form.Item label="Ext Name" name="ext_name" hasFeedback {...displayErrors('ext_name')}>
              <Input autoComplete="off" placeholder="Enter Ext Name" />
            </Form.Item>
            <Form.Item label="Alias" name="alias" hasFeedback {...displayErrors('alias')}>
              <Input autoComplete="off" placeholder="Enter Alias" />
            </Form.Item>
            <Form.Item label="Gender" name="gender" hasFeedback {...displayErrors('gender')}>
              <Select placeholder="Select a Gender">
                <Option value="MALE">MALE</Option>
                <Option value="FEMALE">FEMALE</Option>
              </Select>
            </Form.Item>
            <Form.Item label="Birth Date" name="birth_date" hasFeedback {...displayErrors('birth_date')}>
              <DatePicker style={{width:'100%'}} format="MM-DD-YYYY"/>
            </Form.Item>
            <Form.Item label="Birth Place" name="birth_place" hasFeedback {...displayErrors('birth_place')}>
              <Input autoComplete="off" placeholder="Enter Birth Place" />
            </Form.Item>
        </div>
        <div className="col-md-6 col-lg-4">
            <Form.Item label="Purok or Sitio" name="purok_sitio" hasFeedback {...displayErrors('purok_sitio')}>
                <Input autoComplete="off" placeholder="Enter Purok or Sitio" />
              </Form.Item>
              <Form.Item label="Street Address" name="street_address" hasFeedback {...displayErrors('street_address')}>
                <Input autoComplete="off" placeholder="Enter Street Address" />
              </Form.Item>
              <Form.Item label="Barangay" name="psgc_id" hasFeedback {...displayErrors('psgc_id')}>
                <Select
                  showSearch
                  placeholder="Select a Barangay"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {populateBarangaySelection(props.barangay)}
                </Select>
              </Form.Item>
              <Form.Item label="Occupation" name="occupation" hasFeedback {...displayErrors('occupation')}>
                <Input autoComplete="off" placeholder="Enter Occupation" />
              </Form.Item>
              <Form.Item label="Civil Status" name="civil_status" hasFeedback {...displayErrors('civil_status')}>
                <Select placeholder="Select a Civil Status">
                  <Option value="SINGLE">SINGLE</Option>
                  <Option value="MARRIED">MARRIED</Option>
                  <Option value="DIVORCED">DIVORCED</Option>
                  <Option value="SEPARATED">SEPARATED</Option>
                  <Option value="WIDOWED">WIDOWED</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Contact Number" name="contact_number" hasFeedback {...displayErrors('contact_number')}>
                <Input autoComplete="off" placeholder="Contact Number" />
              </Form.Item>
              {/* <Form.Item label="Contact Number" name="contact_number_2" hasFeedback {...displayErrors('contact_number_2')}>
                <Input autoComplete="off" placeholder="Contact Number 2" />
              </Form.Item> */}
        </div>
        <div className="col-md-6 col-lg-4">
            <Form.Item label="Voters Registration Status" name="is_registered_voter" hasFeedback {...displayErrors('is_registered_voter')}>
              <Select placeholder="Select a Registration Status">
                <Option value="YES">REGISTERED VOTER</Option>
                <Option value="NO">NOT REGISTERED VOTER</Option>
              </Select>
            </Form.Item>
            {
              (formData.is_registered_voter == "YES" ? (
                <>
                  <Form.Item label="Registration Date" name="voters_registration_date" hasFeedback {...displayErrors('voters_registration_date')}>
                    <DatePicker style={{width:'100%'}} format="MM-DD-YYYY"/>
                  </Form.Item>
                  <Form.Item label="Voters ID Number" name="voters_registration_number" hasFeedback {...displayErrors('voters_registration_number')}>
                    <Input autoComplete="off" placeholder="Enter Voters ID Number" />
                  </Form.Item>
                </>
              ) : "")
            }
            <Form.Item label="In Case of Emergency" name="emergency_contact_name" hasFeedback {...displayErrors('emergency_contact_name')}>
              <Input autoComplete="off" placeholder="Enter In Case of Emergency Contact Person" />
            </Form.Item>
            <Form.Item label="Contact Number" name="emergency_contact_number" hasFeedback {...displayErrors('emergency_contact_number')}>
              <Input autoComplete="off" placeholder="Enter In Case of Emergency Contact Number" />
            </Form.Item>
            <Form.Item label="Relationship to the Person" name="emergency_contact_relation" hasFeedback {...displayErrors('emergency_contact_relation')}>
              <Input autoComplete="off" placeholder="Enter In Case of Emergency Contact Person Relationship" />
            </Form.Item>

            <Form.Item {...tailLayout}>
              <Button type="primary" htmlType="submit" disabled={submit}>
                Submit
              </Button>
            </Form.Item>
        </div>
      </div>
          </Form>
    </div>
  );
}


export default connect(
  mapStateToProps,
)(ResidentForm);
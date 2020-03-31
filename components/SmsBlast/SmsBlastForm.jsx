import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Form, Typography, Divider, DatePicker, Modal, Select, Input, Button } from 'antd';
import isEmpty from 'lodash/isEmpty';
import API from '../../api'
import _forEach from 'lodash/forEach'
import _debounce from 'lodash/debounce'
import Swal from 'sweetalert2/dist/sweetalert2.js'

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const smsCounter = {
  childCount: 0,
  pageCount: 0,
  totalCount: 0,
  recipients: {},
  residentPageCount: 0,
  barangayPageCount: 0,
};

function mapStateToProps(state) {
  return {
    barangay: state.resident.barangays,
    formError: state.smsBlast.formError,
    recipients: state.smsBlast.recipients,
    sendStatus: state.smsBlast.sendStatus,
    sentCount: state.smsBlast.sentCount,
    user: state.user.user,
  };
}
const SmsBlastForm = (props) => {
  useEffect(() => {
    loadBarangays();
  }, []);

  const [formData, setFormData] = useState({});
  const [submit, setSubmit] = useState(false);
  const formRef = React.useRef();
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const setFormFields = (e) => {
    if(e.psgc_id && e.psgc_id == "all"){
      e.psgc_id = "";
    }
    setFormData({
      ...formData,
      ...e
    })
  }

  const formSubmit  = _debounce(() => {
    smsCounter.childCount = 0;
    smsCounter.barangayPageCount = 0;
    smsCounter.residentPageCount = 0;
    setSubmit(true);
    props.dispatch({
      type: "SET_SMS_SENDING_STATUS",
      data: true
    })
    formData.user_id = props.user.id;
    API.SmsBlast.add(formData)
    .then(res => {
      let smsBlastResult = res.data.sms_threads;
      smsBlastResult.count = res.data.recipient_count;
      props.dispatch({
        type: "SET_SMS_RECIPIENT",
        data: {
          threads: smsBlastResult,
          resident_recipients: res.data.resident_recipients,
          barangay_official_recipients: res.data.barangay_official_recipients,
        }
      })
      smsCounter.recipients = res.data;
      smsCounter.residentPageCount++;
      sendToRecipient('residents',smsCounter.residentPageCount);
    })
    .catch(res => {
      setSubmit(false);
      props.dispatch({
        type: "SET_SMS_SENDING_STATUS",
        data: false
      })
      if(err.response && err.response.data){
        props.dispatch({
          type: "SMS_FORM_ERROR",
          data: err.response.data
        })
      }
    })
    .then(res => {})
    ;
    
  }, 250)
  const sendToRecipient = (type, page) => {
    API.SmsBlast.getRecipients({type,page})
    .then(res => {
      let recipient = res.data.data;
      sendSms(recipient);  
    })
    .catch(res => {
      setSubmit(false);
      props.dispatch({
        type: "SET_SMS_SENDING_STATUS",
        data: false
      })
    })
    .then(res => {})
    ;
  }
  const sendSms  = (recipient) => {
    if(smsCounter.childCount < recipient.length){
      API.SmsBlast.sendSms(1)
      .then(res => {
        smsCounter.childCount++;
        props.dispatch({
          type: "SET_SMS_SENT_COUNT",
          data: {}
        })
        sendSms(recipient);
      })
      .catch(res => {
        setSubmit(false);
        props.dispatch({
          type: "SET_SMS_SENDING_STATUS",
          data: false
        })
      })
      .then(res => {})
      ;
    }else if(smsCounter.childCount == recipient.length){
      smsCounter.childCount = 0;
      if(smsCounter.residentPageCount < smsCounter.recipients.resident_recipients.last_page){
        smsCounter.residentPageCount++;
        sendToRecipient('residents',smsCounter.residentPageCount)
      }else if(smsCounter.barangayPageCount < smsCounter.recipients.barangay_official_recipients.last_page){
        smsCounter.barangayPageCount++;
        sendToRecipient('barangay_officials',smsCounter.barangayPageCount)
      }else{
        smsCounter.childCount = 0;
        smsCounter.barangayPageCount = 0;
        smsCounter.residentPageCount = 0;
        setSubmit(false);
        props.dispatch({
          type: "SET_SMS_SENDING_STATUS",
          data: false
        })
        Swal.fire(
          'Success!',
          `The system finished sending all messages.`,
          'success'
        )
      }
    }
  }
  const onFinishFailed  = () => {

  }
  const displayErrors = (field) => {
    if(props.formError[field]){
      return {
        validateStatus: 'error',
        help: props.formError[field][0]
      }
    }
  }

  const loadBarangays = () => {
    if(isEmpty(props.barangays)){
      getBarangays();
    }
  }
  const populateBarangaySelection = (barangay) => {
    let items = [];
    items.push(<Option value="all" key="all" >All Barangay</Option>);   
    _forEach(barangay, function(value, key) {
      items.push(<Option value={value.id} key={value.id} >{value.name}</Option>);   
    });
    return items;
  }

  const getBarangays = () => {
    API.BarangayOfficial.getBarangay()
    .then(res => {
      let barangayList = res.data.options[0].cities[0].barangays;
      props.dispatch({
        type: "SET_BARANGAY",
        data: barangayList
      })
    })
    .catch(err => {
      
    })
    .then(res => {
      
    })
    ;
  }

  return (
    <div>
      <Title style={{textAlign: "center"}}>
        SEND SMS
      </Title>
      <Divider />

      <Form {...layout} ref={formRef} layout="horizontal" name="basic" initialValues={{ is_registered_voter: 'YES' }} onValuesChange={setFormFields} onFinish={formSubmit} onFinishFailed={onFinishFailed}>
        <Form.Item label="Barangay" name="psgc_id" hasFeedback {...displayErrors('psgc_id')}>
          <Select
            showSearch
            placeholder="Select a Barangay"
            optionFilterProp="children"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            disabled={props.sendStatus}
          >
            {populateBarangaySelection(props.barangay)}
          </Select>
        </Form.Item>
        <Form.Item label="Send To" name="send_to" hasFeedback {...displayErrors('send_to')}>
          <Select placeholder="Select a Send To" disabled={props.sendStatus}>
            <Option value="BARANGAY OFFICIALS">ALL BARANGAY OFFICIALS</Option>
            <Option value="ALL PUNONG BARANGAY">ALL PUNONG BARANGAY</Option>
            <Option value="ALL RESIDENTS">ALL RESIDENTS</Option>
            <Option value="ALL REGISTERED VOTER RESIDENTS">ALL REGISTERED VOTER RESIDENTS</Option>
            <Option value="ALL NOT REGISTERED VOTER RESIDENTS">ALL NOT REGISTERED VOTER RESIDENTS</Option>
          </Select>
        </Form.Item>
        <Form.Item label="Message" name="message" hasFeedback {...displayErrors('message')}>
          <TextArea placeholder="Type your message." autoSize maxLength="320" disabled={props.sendStatus} />
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit" disabled={props.sendStatus}>
            Submit
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(SmsBlastForm);
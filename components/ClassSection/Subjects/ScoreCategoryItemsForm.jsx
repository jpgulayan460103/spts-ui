import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Tooltip, Input, InputNumber, Badge, List, Modal, Form, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import API from '../../../api'
const { Search } = Input;

function mapStateToProps(state) {
  return {
    selectedClassSection: state.classSection.selectedClassSection
  };
}
const handleClick = () => {}
const ScoreCategoryItemsForm = (props) => {
  useEffect(() => {
    getScoreItems();
    return () => {
      console.log("remvoe");
      
    }
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [scoreItem, setScoreItem] = useState(null);
  const [quizName, setQuizName] = useState(null);
  const [itemsCount, setItemsCount] = useState(0);
  const [scoreItems, setScoreItems] = useState([]);
  const [totalScoreItems, setTotalScoreItems] = useState(0);
  const [isQuizModalVisible, setIsQuizModalVisible] = useState(false);
  const [quizModalTitle, setQuizModalTitle] = useState("");
  const setItem = (value) => {
    if(!isNaN(value)){
      setScoreItem(value);
    }else{
      setScoreItem(null);
    }
  }
  const addScoreItem = () => {
    let formData = {
      class_section_id: props.selectedClassSection.id,
      subject_id: props.subject.id,
      track_id: props.subject.track_id,
      subject_category_id: props.subject.subject_category_id,
      grading_system_id: props.gradingSystem.id,
      item: scoreItem,
      quiz_name: quizName,
      unit_id: props.unitId
    }
    
    API.ScoreItem.add(formData)
    .then(res => {
      message.success(`Successfully added ${formData.quiz_name}`);
      getScoreItems();
    })
    .catch(err => {})
    .then(res => {})
    ;    
  }

  const deleteScoreItem = (id) => {
    let formData = {
      class_section_id: props.selectedClassSection.id,
      subject_id: props.subject.id,
      track_id: props.subject.track_id,
      subject_category_id: props.subject.subject_category_id,
      grading_system_id: props.gradingSystem.id,
      item: scoreItem,
    }
    API.ScoreItem.delete(formData, id)
    .then(res => {
      getScoreItems();
    })
    .catch(err => {})
    .then(res => {})
    ; 
  }
  
  const getScoreItems = () => {
    let formData = {
      class_section_id: props.selectedClassSection.id,
      subject_id: props.subject.id,
      grading_system_id: props.gradingSystem.id,
      unit_id: props.unitId
    }
    API.ScoreItem.all(formData)
    .then(res => {
      let score_items = res.data.score_items;
      setScoreItems(score_items);
      setItemsCount(score_items.length);
      let total = score_items.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.item;
      }, 0);
      setTotalScoreItems(total);
    })
    .catch(res => {})
    .then(res => {})
    ;    
  }

  const showQuizForm = (title) => {
    setQuizModalTitle(`${title} Quizzes`);
    setIsQuizModalVisible(true);
  };
  const submitQuizForm = () => {
    addScoreItem();
    // setIsQuizModalVisible(false);
  };
  const closeQuizForm = () => {
    setIsQuizModalVisible(false);
  };

  const layout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 18,
    },
  };
  const tailLayout = {
    wrapperCol: {
      span: 24,
    },
  };
  
  return (
    <div>
      <b>{ props.gradingSystem.category }: { `${props.gradingSystem.grading_system * 100}%` }</b>
      <Tooltip title="Add Quiz" placement="bottom">
        <Badge count={itemsCount}>
          <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => {showQuizForm(props.gradingSystem.category)}} />
        </Badge>
      </Tooltip>
      <br />
      <br />
      { showForm ? (
        <>
          {/*  */}
          <Button type="primary" icon={<PlusOutlined />} onClick={() => addScoreItem()} />
        </>
      ) : "" }
      <List
        size="small"
        header={<div>List of Quizzes</div>}
        footer={<div>Total: {totalScoreItems} </div>}
        bordered
        dataSource={scoreItems}
        renderItem={item => <List.Item actions={[<a href="#!" onClick={() => deleteScoreItem(item.id) } key="list-loadmore-edit">edit</a>, <a href="#!" onClick={() => deleteScoreItem(item.id) } key="list-loadmore-delete">delete</a>]} >{`${item.quiz_name}: ${item.item}`}</List.Item>}
      />


      <Modal title={quizModalTitle} visible={isQuizModalVisible} onOk={submitQuizForm} onCancel={closeQuizForm} okText="Submit" okButtonProps={{ disabled: false, form: "basic" }} >
        

        <Form
          {...layout}
          name="basic"
          layout="horizontal"
          initialValues={{
            remember: true,
          }}
          // onFinish={onFinish}
          // onFinishFailed={onFinishFailed}
        >

          <Form.Item
            label="Subject"
            name="subject"
            rules={[
              {
                required: true,
                message: 'Please input quiz name.',
              },
            ]}
          >
            <Input placeholder="Type quiz name" defaultValue={props.subject.subject_description} disabled />
          </Form.Item>
          <Form.Item
            label="Quiz Name"
            name="quiz_name"
            rules={[
              {
                required: true,
                message: 'Please input quiz name.',
              },
            ]}
          >
            <Input placeholder="Type quiz name" defaultValue={quizName} onChange={(e) => setQuizName(e.target.value)} />
          </Form.Item>

          <Form.Item
            label="Quiz Items"
            name="item"
            rules={[
              {
                required: true,
                message: 'Please input quiz items.',
              },
            ]}
          >
            <InputNumber style={{width: "100%"}} min={1} max={999} defaultValue={scoreItem} placeholder="Type quiz items" onChange={setItem} />
          </Form.Item>


        </Form>
      </Modal>
    </div>
  );
}


export default connect(
  mapStateToProps,
)(ScoreCategoryItemsForm);
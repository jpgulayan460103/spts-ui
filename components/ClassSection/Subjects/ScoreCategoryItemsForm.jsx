import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Tooltip, Input, InputNumber, Badge, List } from 'antd';
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
  }, []);
  const [showForm, setShowForm] = useState(false);
  const [scoreItem, setScoreItem] = useState(null);
  const [itemsCount, setItemsCount] = useState(0);
  const [scoreItems, setScoreItems] = useState([]);
  const [totalScoreItems, setTotalScoreItems] = useState(0);
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
    }
    
    API.ScoreItem.add(formData)
    .then(res => {
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
  
  return (
    <div>
      <b>{ props.gradingSystem.category }: { `${props.gradingSystem.grading_system * 100}%` }</b>
      &nbsp;
      <Tooltip title="Add Score Items">
        <Badge count={itemsCount}>
          <Button type="primary" shape="circle" icon={<PlusOutlined />} onClick={() => setShowForm(true)} />
        </Badge>
      </Tooltip>
      <br />
      <br />
      { showForm ? (
        <InputNumber min={1} max={999} defaultValue={scoreItem} placeholder="Type score items" onChange={setItem} onPressEnter={addScoreItem} />
      ) : "" }
      <List
        size="small"
        header={<div>List of Score Items</div>}
        footer={<div>Total: {totalScoreItems} </div>}
        bordered
        dataSource={scoreItems}
        renderItem={item => <List.Item actions={[<a href="#!" onClick={() => deleteScoreItem(item.id) } key="list-loadmore-edit">delete</a>]} >{item.item}</List.Item>}
      />
    </div>
  );
}


export default connect(
  mapStateToProps,
)(ScoreCategoryItemsForm);
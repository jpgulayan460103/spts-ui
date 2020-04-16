import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Tooltip, Input, InputNumber } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ScoreCategoryItemsForm from './ScoreCategoryItemsForm';
const { Search } = Input;

function mapStateToProps(state) {
  return {
    tracks: state.appDefault.tracks
  };
}
const handleClick = () => {}
const ScoreItemsForm = (props) => {
  useEffect(() => {
    
  }, []);

  const getSubjectCategories = () => {

  }
  
  

  return (
    <div>
      <div className="row">
        <div className="col-md-4">
          <ScoreCategoryItemsForm gradingSystem={props.subject.subject_category.grading_systems.data[0]} subject={props.subject} />
        </div>
        <div className="col-md-4">
          <ScoreCategoryItemsForm gradingSystem={props.subject.subject_category.grading_systems.data[1]} subject={props.subject} />
        </div>
        <div className="col-md-4">
          <ScoreCategoryItemsForm gradingSystem={props.subject.subject_category.grading_systems.data[2]} subject={props.subject} />
        </div>
      </div>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(ScoreItemsForm);
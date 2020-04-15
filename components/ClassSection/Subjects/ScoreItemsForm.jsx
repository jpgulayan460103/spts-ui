import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Button, Tooltip } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

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
          <b>
          { props.subject.subject_category.grading_systems.data[0].category }
          :&nbsp;
          { `${props.subject.subject_category.grading_systems.data[0].grading_system * 100}%` }
          </b>
          &nbsp;
          <Tooltip title="Add Score Items">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          </Tooltip>
          <br />
        </div>
        <div className="col-md-4">
          <b>
          { props.subject.subject_category.grading_systems.data[1].category }
          :&nbsp;
          { `${props.subject.subject_category.grading_systems.data[1].grading_system * 100}%` }
          </b>
          &nbsp;
          <Tooltip title="Add Score Items">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          </Tooltip>
          <br />
        </div>
        <div className="col-md-4">
          <b>
          { props.subject.subject_category.grading_systems.data[2].category }
          :&nbsp;
          { `${props.subject.subject_category.grading_systems.data[2].grading_system * 100}%` }
          </b>
          &nbsp;
          <Tooltip title="Add Score Items">
            <Button type="primary" shape="circle" icon={<PlusOutlined />} />
          </Tooltip>
          <br />
        </div>
      </div>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(ScoreItemsForm);
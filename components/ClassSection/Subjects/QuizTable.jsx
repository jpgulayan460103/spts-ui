import { get } from 'local-storage';
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import API from '../../../api'
import { message, Button, Space } from 'antd';

function mapStateToProps(state) {
  return {
    selectedSubject: state.classSection.selectedSubject
  };
}
const handleClick = () => {}

const ScoreItem = ({student, quizItem, index, getScores, unitId}) => {
  const [editStatus, setEditStatus] = useState(false);
  const [scoreValue, setscoreValue] = useState(student[quizItem.key]);
  const inputEl = useRef();
  const showEdit = () => {
    if(quizItem.editable){
      setEditStatus(true);
      setTimeout(() => {
        inputEl.current.focus()
      }, 150);
      setscoreValue(student[quizItem.key]);
    }
  }
  const updateScore = (e) => {
    setEditStatus(false)
    let score = scoreValue;
    let scoreItem = student.mappedScores.filter(item => item.scoreKey == quizItem.key);
    addScore(score, scoreItem[0]);
    
    // getScores();
    // console.log(quizItem);
  }
  const addScore = (score, item) => {
    // console.log(item);
    let formData = {
      score_item_id: item.score.score_item_id, 
      subject_id: item.score.subject_id, 
      student_id: item.score.student_id, 
      class_section_id: item.score.class_section_id, 
      grading_system_id: item.score.grading_system_id,
      items: item.score.items,
      score: score,
      unit_id: unitId,
    };
    API.Score.add(formData)
    .then( res => {
      getScores();
      message.success('Successfuly updated the score.');
    })
    .catch( err => {
      message.error('Score update failed.');
    })
    .then( res => {})
  }
  return (
    <td key={quizItem.key} key={`quiz-score-${index}`} >
       { editStatus ? (
         <>
          <input ref={inputEl} type="text" value={scoreValue} onChange={ (e) => { setscoreValue(e.target.value) } } />
          <a href="#!" style={{ marginRight: "20px" }} onClick={() => { updateScore() }}>Save</a>
          <a href="#!" style={{ marginLeft: "20px" }} onClick={() => { setEditStatus(false) }}>Close</a>
        </>
       ): (<p onClick={ showEdit }>{student[quizItem.key]}</p>) }
    </td>
  );
}


const QuizTable = (props) => {
  useEffect(() => {
    // console.log(props.gradingSystem);
  }, []);
  return (
    <div className="table-responsive">
      <table className="table table-bordered" id="quiztable">
        <thead>
          <tr>
            <th rowSpan={3}>Student Name</th>
            { props.gradingSystem.map((gradingSystem, index) => {
              return <th style={{textAlign: "center"}} key={`quiz-${index}`} colSpan={gradingSystem.score_items.length + 3}>{gradingSystem.category} {(gradingSystem.grading_system * 100)}%</th>
            }) }
            <th rowSpan={3} style={{textAlign: "center"}} >Initial Grade</th>
            <th rowSpan={3} style={{textAlign: "center"}} >Transmuted Grade</th>
          </tr>
          <tr>
            { props.columns.map((quizItem, index) => {
              return quizItem.show ? (
                <th style={{textAlign: "center"}} key={quizItem.key} >{quizItem.title}</th>
              ) : (
                <></>
              );
            }) }
          </tr>
          <tr>
            { props.columns.map((quizItem, index) => {
              return quizItem.show ? (
                <th style={{textAlign: "center"}} key={quizItem.key} >{quizItem.value}</th>
              ) : (
                <></>
              );
            }) }
          </tr>
        </thead>
        <tbody>
            { props.dataSource.map((student, index) => {
              return (
                <tr key={`student-row-${index}`}>
                  <td style={{minWidth: "200px", textAlign: "left"}} key={`student-${index}`}>{student.full_name_last}</td>
                  { props.columns.map((quizItem, index) => {
                    return (
                      <ScoreItem key={`quiz-score-${index}`} quizItem={quizItem} student={student} getScores={props.getScores} unitId={props.unitId} />
                    )
                  }) }
                </tr>
              )
            }) }
        </tbody>
      </table>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(QuizTable);
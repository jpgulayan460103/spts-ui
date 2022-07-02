import { get } from 'local-storage';
import React, { useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import API from '../../../api'
import { message, Button, Space, Modal } from 'antd';
import _forEach from 'lodash/forEach'

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

  const updateScoreValue = (e) => {
    let inputScore = e.target.value;
    if(!isNaN(inputScore)){
      if(inputScore >= quizItem.value){
        inputScore = quizItem.value;
      }
      if(inputScore <= 0){
        inputScore = 0;
      }
      setscoreValue(inputScore)
    }
  }


  return (
    <td key={quizItem.key} key={`quiz-score-${index}`} >
       { editStatus ? (
         <>
          <input ref={inputEl} type="text" value={scoreValue} onChange={ (e) => { updateScoreValue(e) } } />
          <a href="#!" style={{ marginRight: "20px" }} onClick={() => { updateScore() }}>Save</a>
          <a href="#!" style={{ marginLeft: "20px" }} onClick={() => { setEditStatus(false) }}>Close</a>
        </>
       ): (<p onClick={ showEdit }>{student[quizItem.key]}</p>) }
    </td>
  );
}


const MultipleScoreItem = ({score, inputMultipleScore, scoreKey}) => {
  const [scoreInput, setScoreInput] = useState(score.score);
  const setScore = (e) => {
    let inputScore = e.target.value;
    if(!isNaN(inputScore)){
      if(inputScore >= score.items){
        inputScore = score.items;
      }
      if(inputScore <= 0){
        inputScore = 0;
      }
      setScoreInput(inputScore);
      inputMultipleScore(inputScore, score, scoreKey);
    }
  }
  return <input type="text" value={scoreInput} onChange={setScore} />
}



const QuizTable = (props) => {
  useEffect(() => {
    // console.log(props.gradingSystem);
  }, []);

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [scoresToEdit, setScoresToEdit] = useState({
    ww: [],
    pt: [],
    qe: [],
  });
  const [scoresToSubmit, setscoresToSubmit] = useState([]);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    // setIsModalVisible(false);
    let proccessedScores = [];
    let class_section_id;
    let subject_id;
    let score_item_id;

    _forEach(scoresToSubmit, function(value, key) {
      value.unit_id = props.unitId;
      proccessedScores.push(value);
      class_section_id = value.class_section_id;
      subject_id = value.subject_id;
      score_item_id = value.score_item_id;
    });
    let formData = {
      class_section_id,
      subject_id,
      score_item_id,
      scores: proccessedScores
    };

    API.Score.addMultiple(formData)
    .then( res => {
      props.getScores();
      message.success('Successfuly updated the score.');
    })
    .catch( err => {
      message.error('Score update failed.');
    })
    .then( res => {})
    // console.log(proccessedScores);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const inputMultipleScore = (score, scoreItem, scoreKey) => {
    let forSubmit = {...scoreItem, score};
    // forSubmit.score = score;
    forSubmit = { [scoreKey]:  forSubmit};
    setscoresToSubmit(prev => {
      return {
        ...prev,
        ...forSubmit
      };
    });
  }

  const editScores = (student) => {
    // console.log(student.mappedScores);
    let ww = student.mappedScores.filter(item => item.score.grading_system_name == "Written Work");
    let pt = student.mappedScores.filter(item => item.score.grading_system_name == "Performance Task");
    let qe = student.mappedScores.filter(item => item.score.grading_system_name == "Quarterly Exam");;
    setScoresToEdit({ww,pt,qe});
    showModal();
    setModalTitle(student.full_name_last);
  }
  return (
    <>
    <Modal title={modalTitle} visible={isModalVisible} onOk={handleOk} onCancel={handleCancel} bodyStyle={{height: "70vh", overflow: "scroll"}} >
      {/* Written Work */}
      <p>Subject: <b>{ props.selectedSubject.subject_description } </b></p>
      <div>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th colSpan="3">Written Work</th>
            </tr>
            <tr>
              <th>Quiz Name</th>
              <th>Score</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            { scoresToEdit.ww.map((item, index) => {
              return (
                <tr key={`ww_${index}`}>
                  <th>{item.score.quiz_name}</th>
                  <th><MultipleScoreItem score={item.score} setscoresToSubmit={setscoresToSubmit} inputMultipleScore={inputMultipleScore} scoreKey={item.scoreKey} /> </th>
                  <th>{item.score.items}</th>
                </tr>
              )
            }) }
          </tbody>
        </table>
        {/* Performance Task */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th colSpan="3">Performance Task</th>
            </tr>
            <tr>
              <th>Quiz Name</th>
              <th>Score</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            { scoresToEdit.pt.map((item, index) => {
              return (
                <tr key={`pt_${index}`}>
                  <th>{item.score.quiz_name}</th>
                  <th><MultipleScoreItem score={item.score} setscoresToSubmit={setscoresToSubmit} inputMultipleScore={inputMultipleScore} scoreKey={item.scoreKey} /> </th>
                  <th>{item.score.items}</th>
                </tr>
              )
            }) }
          </tbody>
        </table>
        {/* Quarterly Exam */}
        <table className="table table-bordered">
          <thead>
            <tr>
              <th colSpan="3">Quarterly Exam</th>
            </tr>
            <tr>
              <th>Quiz Name</th>
              <th>Score</th>
              <th>Items</th>
            </tr>
          </thead>
          <tbody>
            { scoresToEdit.qe.map((item, index) => {
              return (
                <tr key={`qe_${index}`}>
                  <th>{item.score.quiz_name}</th>
                  <th><MultipleScoreItem score={item.score} setscoresToSubmit={setscoresToSubmit} inputMultipleScore={inputMultipleScore} scoreKey={item.scoreKey} /> </th>
                  <th>{item.score.items}</th>
                </tr>
              )
            }) }
          </tbody>
        </table>
      </div>
    </Modal>
    <div className="table-responsive">
      <table className="table table-bordered" id="quiztable">
        <thead>
          <tr>
            <th rowSpan={3} colSpan={2}>Student Name</th>
            { props.gradingSystem.map((gradingSystem, index) => {
              return <th style={{textAlign: "center"}} key={`quiz-${index}`} colSpan={gradingSystem.score_items.length + 3}>{gradingSystem.category} {(gradingSystem.grading_system * 100)}%</th>
            }) }
            <th rowSpan={3} style={{textAlign: "center"}} >Initial Grade</th>
            <th rowSpan={3} style={{textAlign: "center"}} >Transmuted Grade</th>
          </tr>
          <tr>
            { props.columns.map((quizItem, index) => {
              return quizItem.show ? (
                <th style={{textAlign: "center"}} key={`quiz-title-${quizItem.key}`} >{quizItem.title}</th>
              ) : (
                <th key={`quiz-title-${quizItem.key}`}></th>
              );
            }) }
          </tr>
          <tr>
            { props.columns.map((quizItem, index) => {
              return quizItem.show ? (
                <th style={{textAlign: "center"}} key={`quiz-value-${quizItem.key}`} >{quizItem.value}</th>
              ) : (
                <th key={`quiz-value-${quizItem.key}`}></th>
              );
            }) }
          </tr>
        </thead>
        <tbody>
            { props.dataSource.map((student, index) => {
              return (
                <tr key={`student-row-${index}`}>
                  <td style={{minWidth: "200px", textAlign: "left"}} key={`student-${index}`}>{student.full_name_last}</td>
                  <td key={`student-scores-update-${index}`}><a href="#!" onClick={() => { editScores(student) }}>Update Scores</a></td>
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
    </>
  );
}



export default connect(
  mapStateToProps,
)(QuizTable);
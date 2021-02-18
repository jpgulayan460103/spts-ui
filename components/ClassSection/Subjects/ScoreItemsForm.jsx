import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { Input, Tabs, Table, InputNumber  } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import ScoreCategoryItemsForm from './ScoreCategoryItemsForm';
import API from '../../../api'
import _isEmpty from 'lodash/isEmpty'
import _cloneDeep from 'lodash/cloneDeep'
import _debounce from 'lodash/debounce'
import QuizTable from "./QuizTable";

import { InputGroup } from 'reactstrap';
const { Search } = Input;
const { TabPane } = Tabs;

function mapStateToProps(state) {
  return {
    tracks: state.appDefault.tracks,
    transmutedGrades: state.appDefault.transmutedGrades,
    students: state.classSection.students,
    selectedClassSection: state.classSection.selectedClassSection,
    selectedSubject: state.classSection.selectedSubject,
  };
}
const handleClick = () => {}
const defaultCols = [
  {
    title: 'Full Name',
    key: 'student',
    width: 300,
    render: (text, record, index) => (
      <span>
        {record.full_name_last}<br />
        [{record.student_id_number}]<br />
      </span>
    ),
  },
  {
    title: 'Written Work',
    key: 'ww',
    width: 100,
    render: (text, record, index) => (
      <span>1</span>
    ),
  },
  {
    title: 'Performance Test',
    key: 'pt',
    width: 100,
    render: (text, record, index) => (
      <span>2</span>
    ),
  },
  {
    title: 'Quarterly Exam',
    key: 'qe',
    width: 100,
    render: (text, record, index) => (
      <span>3</span>
    ),
  },
];

const ScoreItemsForm = (props) => {
  useEffect(() => {
    setStudents(props.students);
  }, [props.students]);


  const [gradingSystem, setGradingSystem] = useState([])
  const [students, setStudents] = useState([])
  const [scores, setScores] = useState([])
  const [currentTab, setCurrentTab] = useState([]);
  const [quizCols, setQuizCols] = useState(defaultCols);

  const addValueScore = _debounce((e, record, item, studentIndex) => {
    // let score = e.target.value;
    let score = e;
    console.log(score);
    let formData = {
      score: score,
      student_id: record.id,
      score_item_id: item.id,
      class_section_id: props.selectedClassSection.id,
      subject_id: props.selectedSubject.id,
      grading_system_id: item.grading_system_id,
    };
    let scoreIndex = students[studentIndex].scores.findIndex(score => score.score_item_id == item.id);
    if(students[studentIndex].scores[scoreIndex]){
      students[studentIndex].scores[scoreIndex].score = score;
    }

    let propsStudents = students.map(item => {
      return item;
    });
    // setStudents(propsStudents);
    API.Score.add(formData)
    .then(res => {
      let student_scores = res.data.scores;
      // getScores();
      // computeGrade(student_scores, studentIndex, gradingSystem);
    })
    .catch(err => {})
    .then(res => {})
    ;
  }, 0)


  const computeGrade = (student_scores, studentIndex, gradingSystem) => {
    let student_score_total = 0;
    let ww_score_total = 0;
    let ww_score_total_items = 0;
    let ww_score_ps = 0;
    let ww_score_ws = 0;
    let pt_score_total = 0;
    let pt_score_total_items = 0;
    let pt_score_ps = 0;
    let pt_score_ws = 0;
    let qe_score_total = 0;
    let qe_score_total_items = 0;
    let qe_score_ps = 0;
    let qe_score_ws = 0;
    let filteredTransmutedGrades;
    let transmutedGrade;
    if(!_isEmpty(student_scores)){
      student_score_total = student_scores.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.score;
      }, 0);
    }
    let ww_scores = student_scores.filter(score => score.grading_system_id == gradingSystem[0].id);
    if(!_isEmpty(ww_scores)){
      ww_score_total = ww_scores.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.score;
      }, 0);
      ww_score_total_items = gradingSystem[0].total;
      ww_score_ps = ((ww_score_total / ww_score_total_items) * 100).toFixed(2);
      ww_score_ws = (ww_score_ps * gradingSystem[0].grading_system).toFixed(2);
    }
    let pt_scores = student_scores.filter(score => score.grading_system_id == gradingSystem[1].id);
    if(!_isEmpty(pt_scores)){
      pt_score_total = pt_scores.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.score;
      }, 0);
      pt_score_total_items = gradingSystem[1].total;
      pt_score_ps = ((pt_score_total / pt_score_total_items) * 100).toFixed(2);
      pt_score_ws = (pt_score_ps * gradingSystem[1].grading_system).toFixed(2);
    }
    let qe_scores = student_scores.filter(score => score.grading_system_id == gradingSystem[2].id);
    if(!_isEmpty(qe_scores)){
      qe_score_total = qe_scores.reduce((accumulator, currentValue) => {
        return accumulator + currentValue.score;
      }, 0);
      qe_score_total_items = gradingSystem[2].total;
      qe_score_ps = ((qe_score_total / qe_score_total_items) * 100).toFixed(2);
      qe_score_ws = (qe_score_ps * gradingSystem[2].grading_system).toFixed(2);
    }
    
    let propsStudents = props.students.map((student, index) => {
      if(studentIndex == index){
        student.ww_score_total = ww_score_total;
        student.pt_score_total = pt_score_total;
        student.qe_score_total = qe_score_total;
        student.student_score_total = student_score_total;
        student.ww_score_ps = ww_score_ps;
        student.ww_score_ws = ww_score_ws;
        student.pt_score_ps = pt_score_ps;
        student.pt_score_ws = pt_score_ws;
        student.qe_score_ps = qe_score_ps;
        student.qe_score_ws = qe_score_ws;
        student.ww_score_total_items = ww_score_total_items;
        student.pt_score_total_items = pt_score_total_items;
        student.qe_score_total_items = qe_score_total_items;
        student.grade = parseFloat(ww_score_ws) + parseFloat(pt_score_ws) + parseFloat(qe_score_ws);
        filteredTransmutedGrades = props.transmutedGrades.filter(grade => grade.grade < student.grade);
        transmutedGrade = filteredTransmutedGrades[filteredTransmutedGrades.length - 1];
        student.transmuted_grade = transmutedGrade ? transmutedGrade.transmuted_grade : 0;
        student.grade = student.grade.toFixed(2);

      }
      return student;
    });
    setStudents(propsStudents);
  }

  const inputScore = (record, selectedGradingSystem, index) => {
    let studentScore = null;
    if(selectedGradingSystem){
      
      let score_items = selectedGradingSystem.score_items;
      let defaultValue = null;
      return score_items.map(item => {
        if(record.scores){
          studentScore = record.scores.filter(scoreItem => {
            if(scoreItem.score_item_id == item.id && scoreItem.student_id == record.id){
              return true;
            }else{
              return false;
            }
          });          
          if(!_isEmpty(studentScore)){
            studentScore = parseInt(studentScore[0].score);
            // studentScore =
          }else{
            studentScore = null;
          }
        }else{
          studentScore = null;
        }
        return (
          <div style={{float: "left"}}>
            <div style={{textAlign: "center"}}>{item.item}</div>
            <InputScoreComponent item={item} studentScore={studentScore} record={record} index={index} key={`${index}_${selectedGradingSystem}`} />
          </div>
        );
        // return (<span>{item.item} </span>);
      });
    }
  }

  const InputScoreComponent = ({item, studentScore, record, index }) => {
    let score = studentScore == null ? 0 : studentScore;
    const [inputValue, setinputValue] = useState(score);
    const textInput = React.createRef();
    return (
      <span>
        <InputNumber ref={textInput} size="small" style={{width: 90}} min={0} max={item.item} value={inputValue} defaultValue={inputValue} onBlur={(e) => {
            let val = textInput.current.inputNumberRef.currentValue;
            addValueScore(val, record, item, index);
            setinputValue(val);
          }
        } />
      </span>
    );
  }

  const columnWidth = (selectedGradingSystem) => {
    if(selectedGradingSystem){
      let score_items = selectedGradingSystem.score_items;
      if(score_items.length <= 1){
        return '200px';
      }else{
        return `${((score_items.length * 90) + 32)}px`
      }
    }else{
      return '200px';
    }
  }

  const testClick = (index) => {
    let propsStudents = props.students.map(item => {
      item.ww = 10;
      return item;
    });
    // students[index].ww = 20;
    setStudents(propsStudents);
  }


  const gradeLabel = (gradeLabel) => {
    if(gradeLabel){
      return `${(gradeLabel.grading_system * 100)}%`;
    }
  }


  const studentDataSource = students;
  const studentScoreColumnsV2 = quizCols;
  const studentScoreColumns = [
    {
      title: 'Full Name',
      key: 'student',
      width: 300,
      fixed: 'left',
      render: (text, record, index) => (
        <span>
          {record.full_name_last}<br />
          [{record.student_id_number}]<br />
        </span>
      ),
    },
    {
      title: 'Written Work',
      key: 'ww',
      width: columnWidth(gradingSystem[0]),
      render: (text, record, index) => (
        <span>
          { inputScore(record, gradingSystem[0], index) }
        </span>
      ),
    },
    {
      title: 'Performance Test',
      key: 'pt',
      width: columnWidth(gradingSystem[1]),
      render: (text, record, index) => (
        <span>
          { inputScore(record, gradingSystem[1], index) }
        </span>
      ),
    },
    {
      title: 'Quarterly Exam',
      key: 'qe',
      width: columnWidth(gradingSystem[2]),
      render: (text, record, index) => (
        <span>
          { inputScore(record, gradingSystem[2], index) }
        </span>
      ),
    },
  ];
  const studentGradeColumns = [
    {
      title: 'Full Name',
      key: 'student',
      width: 300,
      fixed: 'left',
      render: (text, record, index) => (
        <span>
          {record.full_name_last}<br />
          [{record.student_id_number}]<br />
          <span onClick={() => testClick(index)}>test</span>
        </span>
      ),
    },
    {
      title: `Written Work ${gradeLabel(gradingSystem[0])}`,
      key: 'ww',
      render: (text, record, index) => (
        <span>
          {record.ww_score_total}/{record.ww_score_total_items} = {record.ww_score_ps}
        </span>
      ),
    },
    {
      title: `WS`,
      key: 'wp_ws',
      render: (text, record, index) => (
        <span>
          { record.ww_score_ws }
        </span>
      ),
    },
    {
      title: `Performance Test ${gradeLabel(gradingSystem[1])}`,
      key: 'pt',
      render: (text, record, index) => (
        <span>
          {record.pt_score_total}/{record.pt_score_total_items} = {record.pt_score_ps}
        </span>
      ),
    },
    {
      title: `WS`,
      key: 'pt_ws',
      render: (text, record, index) => (
        <span>
          { record.pt_score_ws }
        </span>
      ),
    },
    {
      title: `Quarterly Exam ${gradeLabel(gradingSystem[2])}`,
      key: 'qe',
      render: (text, record, index) => (
        <span>
          {record.qe_score_total}/{record.qe_score_total_items} = {record.qe_score_ps}
        </span>
      ),
    },
    {
      title: `WS`,
      key: 'pt_ws',
      render: (text, record, index) => (
        <span>
          { record.qe_score_ws }
        </span>
      ),
    },
    {
      title: `Initial Grade`,
      key: 'student_grade',
      render: (text, record, index) => (
        <span>
          { record.grade }
        </span>
      ),
    },
    {
      title: `Transmuted Grade`,
      key: 'student_transmuted_grade',
      render: (text, record, index) => (
        <span>
          { record.transmuted_grade }
        </span>
      ),
    },
  ];
  const changeTab = (key) => {
    // setGradingSystem([]);
    setCurrentTab(key);
    if(key == "1" || key == "3"){
      getScores();
    }
  }

  const getScores = () => {
    let formData = {
      class_section_id: props.selectedClassSection.id,
      subject_id: props.selectedSubject.id,
      unit_id: props.unitId
    }
    API.ScoreItem.all(formData)
    .then(res => {
      let score_items = res.data.score_items;
      let student_scores = res.data.scores;
      let grading_systems = res.data.grading_systems;
      let score_items_0 = score_items.filter(item => item.grading_system_id == grading_systems[0].id);
      grading_systems[0].score_items = score_items_0;
      grading_systems[0].total = score_items_0
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue.item;
        }, 0);
      let score_items_1 = score_items.filter(item => item.grading_system_id == grading_systems[1].id);
      grading_systems[1].score_items = score_items_1;
      grading_systems[1].total = score_items_1
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue.item;
        }, 0);
      let score_items_2 = score_items.filter(item => item.grading_system_id == grading_systems[2].id);
      grading_systems[2].score_items = score_items_2;
      grading_systems[2].total = score_items_2
        .reduce((accumulator, currentValue) => {
          return accumulator + currentValue.item;
        }, 0);
      setGradingSystem(grading_systems);
      // console.log(grading_systems);
      setScores(res.data.scores);
      // let cols = quizCols;
      let cols = [];
      let score_items_0_total = 0;
      score_items_0.forEach(element => {
        score_items_0_total += element.item;
        cols.push(
          { title: `${element.quiz_name}`, dataIndex: `item-${element.grading_system_id}-${element.id}`, key: `item-${element.grading_system_id}-${element.id}`, show: true, editable: true, value: element.item }
        );
      });
      cols.push({ title: `Total`, dataIndex: `ww_score_total`, key: `ww_score_total`, show: true, editable: false, value: score_items_0_total });
      // cols.push({ title: `ww_score_total_items`, dataIndex: `ww_score_total_items`, key: `ww_score_total_items`, show: true, editable: false });
      cols.push({ title: `PS`, dataIndex: `ww_score_ps`, key: `ww_score_ps`, show: true, editable: false, value: 100 });
      cols.push({ title: `WS`, dataIndex: `ww_score_ws`, key: `ww_score_ws`, show: true, editable: false, value: (grading_systems[0].grading_system * 100).toFixed(2) });

      let score_items_1_total = 0;
      score_items_1.forEach(element => {
        score_items_1_total += element.item;
        cols.push(
          { title: `${element.quiz_name}`, dataIndex: `item-${element.grading_system_id}-${element.id}`, key: `item-${element.grading_system_id}-${element.id}`, show: true, editable: true, value: element.item }
        );
      });
      
      cols.push({ title: `Total`, dataIndex: `pt_score_total`, key: `pt_score_total`, show: true, editable: false, value: score_items_1_total });
      // cols.push({ title: `pt_score_total_items`, dataIndex: `pt_score_total_items`, key: `pt_score_total_items`, show: true, editable: false });
      cols.push({ title: `PS`, dataIndex: `pt_score_ps`, key: `pt_score_ps`, show: true, editable: false, value: 100 });
      cols.push({ title: `WS`, dataIndex: `pt_score_ws`, key: `pt_score_ws`, show: true, editable: false, value: (grading_systems[1].grading_system * 100).toFixed(2) });

      let score_items_2_total = 0;
      score_items_2.forEach(element => {
        score_items_2_total += element.item;
        cols.push(
          { title: `${element.quiz_name}`, dataIndex: `item-${element.grading_system_id}-${element.id}`, key: `item-${element.grading_system_id}-${element.id}`, show: true, editable: true, value: element.item }
        );
      });

      cols.push({ title: `Total`, dataIndex: `qe_score_total`, key: `qe_score_total`, show: true, editable: false, value: score_items_2_total });
      // cols.push({ title: `qe_score_total_items`, dataIndex: `qe_score_total_items`, key: `qe_score_total_items`, show: true, editable: false });
      cols.push({ title: `PS`, dataIndex: `qe_score_ps`, key: `qe_score_ps`, show: true, editable: false, value: 100 });
      cols.push({ title: `WS`, dataIndex: `qe_score_ws`, key: `qe_score_ws`, show: true, editable: false, value: (grading_systems[2].grading_system * 100).toFixed(2) });

      cols.push({ title: `grade`, dataIndex: `grade`, key: `grade`, show: false, editable: false, value: 0 });
      cols.push({ title: `transmuted_grade`, dataIndex: `transmuted_grade`, key: `transmuted_grade`, show: false, editable: false, value: 0 });


      setQuizCols(cols);
      let mapScoresToStudents = students.map((student, studentIndex) => {
        student.scores = student_scores.filter(score => score.student_id == student.id);
        student.mappedScores = [];
        score_items.forEach(element => {
          // console.log(element);
          let item_score = student_scores.filter(score => score.score_item_id == element.id && score.student_id == student.id);
          student[`item-${element.grading_system_id}-${element.id}`] = _isEmpty(item_score) ? 0 : item_score[0].score;

          student.mappedScores.push({
            scoreKey: `item-${element.grading_system_id}-${element.id}`,
            score: _isEmpty(item_score) ? {
              class_section_id: props.selectedClassSection.id,
              grading_system_id: element.grading_system_id,
              score_item_id: element.id,
              student_id: student.id,
              subject_id: props.selectedSubject.id,
              items: element.item
            } : {...item_score[0], items: element.item}
          });

        });


        /* 
        
        score_items_0.forEach(element => {
          let item_score = student_scores.filter(score => score.score_item_id == element.id && score.student_id == student.id);
          student[`item-${element.grading_system_id}-${element.id}`] = _isEmpty(item_score) ? 0 : item_score[0].score;
        });
        score_items_1.forEach(element => {
          let item_score = student_scores.filter(score => score.score_item_id == element.id && score.student_id == student.id);
          student[`item-${element.grading_system_id}-${element.id}`] = _isEmpty(item_score) ? 0 : item_score[0].score;
        });
        score_items_2.forEach(element => {
          let item_score = student_scores.filter(score => score.score_item_id == element.id && score.student_id == student.id);
          student[`item-${element.grading_system_id}-${element.id}`] = _isEmpty(item_score) ? 0 : item_score[0].score;
        });
        
        */
        computeGrade(student.scores, studentIndex, grading_systems);
        return student;
      });
      
      console.log(mapScoresToStudents);
      setStudents(mapScoresToStudents);
    })
  }
  

  return (
    <div>
      <Tabs onChange={changeTab} defaultActiveKey="2" type="card">
        <TabPane tab="Quizzes" key="2">
          <div className="row">
            <div className="col-md-4">
              <ScoreCategoryItemsForm gradingSystem={props.subject.subject_category.grading_systems.data[0]} subject={props.subject}  unitId={props.unitId} />
            </div>
            <div className="col-md-4">
              <ScoreCategoryItemsForm gradingSystem={props.subject.subject_category.grading_systems.data[1]} subject={props.subject}  unitId={props.unitId} />
            </div>
            <div className="col-md-4">
              <ScoreCategoryItemsForm gradingSystem={props.subject.subject_category.grading_systems.data[2]} subject={props.subject}  unitId={props.unitId} />
            </div>
          </div>
        </TabPane>
        <TabPane tab="Scores" key="1">
          <QuizTable getScores={getScores} dataSource={studentDataSource} columns={quizCols} gradingSystem={gradingSystem} unitId={props.unitId} />
          {/* <Table bordered pagination={false} dataSource={studentDataSource} columns={studentScoreColumnsV2} scroll={{ y: 240 }} /> */}
        </TabPane>
        <TabPane tab="Grades" key="3">
          <Table pagination={false} bordered dataSource={studentDataSource} columns={studentGradeColumns} scroll={{ y: 240 }} />
        </TabPane>
      </Tabs>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(ScoreItemsForm);
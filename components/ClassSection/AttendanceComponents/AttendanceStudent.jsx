import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _cloneDeep from 'lodash/cloneDeep';
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';
import { message, InputNumber} from 'antd' 
import API from '../../../api';

function mapStateToProps(state) {
  return {
    students: state.classSection.students,
    selectedClassSection: state.classSection.selectedClassSection,
    selectedSubject: state.classSection.selectedSubject,
  };
}
const InputAttendance = (props) => {
  const [value, setValue] = useState(props.attendance.present_days);
  const changeValue = (e) => {
    setValue(e.target.value);
    props.changeAttendance(e,props.attendance);
  }
  return <span><InputNumber min={0} max={props.attendance.max} value={value} placeholder="Enter Number of Days" onBlur={(e) => changeValue(e)} /></span>
}
const handleClick = () => {}
const AttendanceStudent = (props) => {
  useEffect(() => {
    setTableColums();
    setStuds();
  }, [props.attendanceWeeks, props.attendances]);


  const [students, setStudents] = useState([]);
  const [columns, setColumns] = useState([]);


  //actions

  const setTableColums = () => {
    let cols = [];
    cols.push({ title: `Student Name`, dataIndex: `full_name_last`, key: `full_name_last` });
    
    _forEach(props.attendanceWeeks, function(attendanceWeek, key) {
      cols.push({ title: attendanceWeek.week_name, dataIndex: `attendance_${attendanceWeek.id}`, key: `attendance_${attendanceWeek.id}` });
    });
    setColumns(cols);
  }

  const setStuds = () => {
    let studs = _cloneDeep(props.students);

    studs.map(stud => {
      _forEach(props.attendanceWeeks, function(attendanceWeek, key) {
        let data = props.attendances.filter(item => item.student_attendance_week_id == attendanceWeek.id && item.student_id == stud.id);
        if(_isEmpty(data)){
          stud[`attendance_${attendanceWeek.id}`] = {
            class_section_id: props.selectedClassSection.id,
            subject_id: props.selectedSubject.id,
            student_attendance_week_id: attendanceWeek.id,
            student_id: stud.id,
            present_days: 0,
            max: attendanceWeek.number_of_days,
            type: "create",
          };
        }else{
          data = data[0];
          data.type = "update";
          data.max = attendanceWeek.number_of_days;
          stud[`attendance_${attendanceWeek.id}`] = data;
        }
      });
    });

    setStudents(studs);
  }

  const changeAttendance = (e,attendance) => {
    attendance.present_days = e.target.value;
    if(attendance.type == "create"){
      API.Attendance.addAttendance(attendance)
      .then(res => {
        message.success('Successfuly saved.');
      });
    }else{
      API.Attendance.updateAttendance(attendance)
      .then(res => {
        message.success('Successfuly saved.');
      });
    }
  }
  
  return (
    <div>
      <table className="table table-bordered">
        <thead>
          <tr>
            { columns.map((col, index) => {
              return <th style={{textAlign: "center"}} key={col.key}>{col.title}</th>
            }) }
          </tr>
        </thead>
        <tbody>
            { students.map((stud, index) => {
              return (
                <tr key={`student-row-${index}`}>
                  { columns.map((col, index) => {
                    if(col.dataIndex != "full_name_last"){
                      return (
                        <td style={{textAlign: "center"}} key={col.key}>
                          {/* { stud[col.dataIndex].present_days } */}
                          <InputAttendance attendance={stud[col.dataIndex]} changeAttendance={changeAttendance} />
                          {/* { stud[col.dataIndex].max } */}
                          {/* <input type="number" defaultValue={stud[col.dataIndex].present_days} /> */}
                          {/* <InputNumber min={0} max={stud[col.dataIndex].max} value={stud[col.dataIndex].present_days} placeholder="Enter Number of Days" onBlur={(e) => changeAttendance(e,stud[col.dataIndex])} /> */}
                        </td>
                      )
                    }else{
                      return <td style={{textAlign: "center"}} key={col.key}> { stud[col.dataIndex] }</td>
                    }
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
)(AttendanceStudent);
import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _cloneDeep from 'lodash/cloneDeep';
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';
import { message, InputNumber} from 'antd' 
import API from '../../../api';

function mapStateToProps(state) {
  return {
    // students: state.classSection.students,
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
            { props.columns.map((col, index) => {
              return <th style={{textAlign: "center"}} key={col.key}>{col.title}</th>
            }) }
          </tr>
        </thead>
        <tbody>
            { props.students.map((stud, index) => {
              return (
                <tr key={`student-row-${index}`}>
                  { props.columns.map((col, index) => {
                    if(col.dataIndex != "full_name_last"){
                      
                      if(typeof stud[col.dataIndex] == "undefined"){

                      }else{
                        let max = stud[col.dataIndex].max;
                        let present_days = stud[col.dataIndex].present_days;
                        console.log(stud[col.dataIndex]);
                        return (
                          <td style={{textAlign: "center"}} key={col.key}>
                            {/* { stud[col.dataIndex].present_days } */}
                            <InputAttendance attendance={stud[col.dataIndex]} changeAttendance={changeAttendance} />
                            {/* { stud[col.dataIndex].max } */}
                            {/* <input type="number" defaultValue={stud[col.dataIndex].present_days} /> */}
                            {/* <InputNumber min={0} max={max} value={present_days} placeholder="Enter Number of Days" onBlur={(e) => changeAttendance(e,stud[col.dataIndex])} /> */}
                          </td>
                        )
                      }
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
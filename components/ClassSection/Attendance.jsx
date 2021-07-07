import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import API from './../../api'
import AttendanceForm from './AttendanceComponents/AttendanceForm'

function mapStateToProps(state) {
  return {
    
  };
}
const handleClick = () => {}
const Attendance = (props) => {
  const [countTest, setCountTest] = useState(0);
  useEffect(() => {
    console.log("added");
    return () => {
      
    };
  }, []);

  const testClick = () => {

    API.Track.all().then(res => {
      setCountTest(res.data.tracks.data.length);
    });
  }
  return (
    <div className="row">
      <div className="col-md-3">
        <AttendanceForm />
      </div>
      <div className="col-md-9">
        asuduiasdhuiashud
      </div>
    </div>
  );
}



export default connect(
  mapStateToProps,
)(Attendance);
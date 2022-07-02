import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import _cloneDeep from 'lodash/cloneDeep';
import _forEach from 'lodash/forEach';
import _isEmpty from 'lodash/isEmpty';
import { Table } from 'antd';
import { map } from 'lodash';


function mapStateToProps(state) {
  return {
    students: state.classSection.students,
  };
}

const UnitSummary = (props) => {
  useEffect(() => {
    let ua = [];
    let newCols = [{
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
    }];
    for (let index = 0; index < props.units.length; index++) {
      const unit_actions = props.units[index].unit_actions.data;
      ua = [...ua, ...unit_actions];
      let newCol = {
        title: props.units[index].unit_name,
        key: props.units[index].key,
        width: 300,
        fixed: 'left',
        render: (text, record, index) => {
          let action = unit_actions.filter(uAction => uAction.student_id == record.id);
          return (
            <span>
              { action[0]?.action }
            </span>
          );
        },
      };
      newCols = [...newCols, newCol];
    }
    setColumns(newCols);
    setUnitActions(ua);
  }, [props.units]);
  
  const [unitActions, setUnitActions] = useState([]);
  const [columns, setColumns] = useState([
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
  ]);
  const studentGradeColumns = columns ;
  const studentDataSource = props.students;
  return (
    <div>
      <Table pagination={false} bordered dataSource={studentDataSource} columns={studentGradeColumns} />
    </div>
  );
}



export default connect(
  mapStateToProps,
)(UnitSummary);
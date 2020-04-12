import { combineReducers } from 'redux'
import user from './userReducer'
import student from './studentReducer'
import teacher from './teacherReducer'
import subject from './subjectReducer'
import appDefault from './appDefaultReducer'
import classSection from './classSectionReducer'
import smsBlast from './smsBlastReducer'

const rootReducer = combineReducers({
  user,
  student,
  teacher,
  subject,
  appDefault,
  classSection,
  smsBlast,
})

export default rootReducer

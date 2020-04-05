import { combineReducers } from 'redux'
import user from './userReducer'
import student from './studentReducer'
import subject from './subjectReducer'
import appDefault from './appDefaultReducer'
import classSection from './classSectionReducer'
import smsBlast from './smsBlastReducer'

const rootReducer = combineReducers({
  user,
  student,
  subject,
  appDefault,
  classSection,
  smsBlast,
})

export default rootReducer

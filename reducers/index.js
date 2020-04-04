import { combineReducers } from 'redux'
import user from './userReducer'
import student from './studentReducer'
import classSection from './classSectionReducer'
import smsBlast from './smsBlastReducer'

const rootReducer = combineReducers({
  user,
  student,
  classSection,
  smsBlast,
})

export default rootReducer

import { combineReducers } from 'redux'
import user from './userReducer'
import resident from './residentReducer'
import barangayOfficial from './barangayOfficialReducer'
import smsBlast from './smsBlastReducer'

const rootReducer = combineReducers({
  user,
  resident,
  barangayOfficial,
  smsBlast,
})

export default rootReducer

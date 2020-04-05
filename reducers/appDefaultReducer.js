const initialState = () => {
  return {
    tracks: [],
    quarters: [],
    semesters: [],
  }
}

export default function appDefaultReducer(state = initialState(), action) {
  switch (action.type) {
    case 'SET_TRACKS':
      state.tracks = action.data;
      return state;
    case 'SET_QUARTERS':
      state.quarters = action.data;
      return state;
    case 'SET_SEMESTERS':
      state.semesters = action.data;
      return state;
    default:
      return state;
  }
}

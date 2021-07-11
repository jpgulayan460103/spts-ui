import axios from './axios-settings'

export default {
  
  addWeek(formdata){
    return axios.post(`/api/student-attendance-week`,formdata);
  },
  updateWeek(formdata,id){
    return axios.put(`/api/student-attendance-week/${id}`,formdata);
  },
  deleteWeek(id){
    return axios.delete(`/api/student-attendance-week/${id}`);
  },
  allWeek(formData){
    return axios.get(`/api/student-attendance-week`,{
      params: formData
    });
  },
  getWeek(id){
    return axios.get(`/api/student-attendance-week/${id}`);
  },

  updateAttendance(formdata){
    return axios.put(`/api/student-attendance/${formdata.id}`,formdata);
  },
  addAttendance(formdata){
    return axios.post(`/api/student-attendance`,formdata);
  },
}
import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`/api/semesters`,formdata);
  },
  update(formdata,id){
    return axios.put(`/api/semesters/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`/api/semesters/${id}`);
  },
  all(formData){
    return axios.get(`/api/semesters`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`/api/semesters/${id}`);
  },
  getTransmutedGrade(){
    return axios.get(`/api/transmuted-grades`);
  }
}
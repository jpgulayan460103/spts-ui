import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`/api/students`,formdata);
  },
  update(formdata,id){
    return axios.put(`/api/students/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`/api/students/${id}`);
  },
  all(formData){
    return axios.get(`/api/students`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`/api/students/${id}`);
  }
}
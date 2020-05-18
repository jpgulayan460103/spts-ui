import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`/api/quarters`,formdata);
  },
  update(formdata,id){
    return axios.put(`/api/quarters/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`/api/quarters/${id}`);
  },
  all(formData){
    return axios.get(`/api/quarters`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`/api/quarters/${id}`);
  }
}
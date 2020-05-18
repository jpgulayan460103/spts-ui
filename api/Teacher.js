import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`/api/teachers`,formdata);
  },
  update(formdata,id){
    return axios.put(`/api/teachers/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`/api/teachers/${id}`);
  },
  all(formData){
    return axios.get(`/api/teachers`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`/api/teachers/${id}`);
  }
}
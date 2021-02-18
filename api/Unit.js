import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`/api/units`,formdata);
  },
  update(formdata,id){
    return axios.put(`/api/units/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`/api/units/${id}`);
  },
  all(formData){
    return axios.get(`/api/units`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`/api/units/${id}`);
  }
}
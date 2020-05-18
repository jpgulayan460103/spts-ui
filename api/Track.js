import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`/api/tracks`,formdata);
  },
  update(formdata,id){
    return axios.put(`/api/tracks/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`/api/tracks/${id}`);
  },
  all(formData){
    return axios.get(`/api/tracks`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`/api/tracks/${id}`);
  }
}
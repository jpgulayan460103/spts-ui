import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`${axios.custom_base_url}api/subjects`,formdata);
  },
  update(formdata,id){
    return axios.put(`${axios.custom_base_url}api/subjects/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`${axios.custom_base_url}api/subjects/${id}`);
  },
  all(formData){
    return axios.get(`${axios.custom_base_url}api/subjects`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`${axios.custom_base_url}api/subjects/${id}`);
  }
}
import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`${axios.custom_base_url}api/teachers`,formdata);
  },
  update(formdata,id){
    return axios.put(`${axios.custom_base_url}api/teachers/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`${axios.custom_base_url}api/teachers/${id}`);
  },
  all(formData){
    return axios.get(`${axios.custom_base_url}api/teachers`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`${axios.custom_base_url}api/teachers/${id}`);
  }
}
import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`${axios.custom_base_url}api/semesters`,formdata);
  },
  update(formdata,id){
    return axios.put(`${axios.custom_base_url}api/semesters/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`${axios.custom_base_url}api/semesters/${id}`);
  },
  all(formData){
    return axios.get(`${axios.custom_base_url}api/semesters`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`${axios.custom_base_url}api/semesters/${id}`);
  }
}
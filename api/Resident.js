import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`/api/residents`,formdata);
  },
  update(formdata,id){
    return axios.put(`/api/residents/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`/api/residents/${id}`);
  },
  all(formData){
    return axios.get(`/api/residents`,{
      params: formData
    });
  },
  getBarangay(){
    return axios.get(`/api/psgcs/dropdown`);
  },
  get(id){
    return axios.get(`/api/residents/${id}`);
  }
}
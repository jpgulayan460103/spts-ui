import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`${axios.custom_base_url}api/residents`,formdata);
  },
  update(formdata,id){
    return axios.put(`${axios.custom_base_url}api/residents/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`${axios.custom_base_url}api/residents/${id}`);
  },
  all(formData){
    return axios.get(`${axios.custom_base_url}api/residents`,{
      params: formData
    });
  },
  getBarangay(){
    return axios.get(`${axios.custom_base_url}api/psgcs/dropdown`);
  },
  get(id){
    return axios.get(`${axios.custom_base_url}api/residents/${id}`);
  }
}
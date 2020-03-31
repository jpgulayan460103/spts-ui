import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`${axios.custom_base_url}api/barangay-officials`,formdata);
  },
  update(formdata,id){
    return axios.put(`${axios.custom_base_url}api/barangay-officials/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`${axios.custom_base_url}api/barangay-officials/${id}`);
  },
  all(formData){
    return axios.get(`${axios.custom_base_url}api/barangay-officials`,{
      params: formData
    });
  },
  getBarangay(){
    return axios.get(`${axios.custom_base_url}api/psgcs/dropdown`);
  },
  get(id){
    return axios.get(`${axios.custom_base_url}api/barangay-officials/${id}`);
  }
}
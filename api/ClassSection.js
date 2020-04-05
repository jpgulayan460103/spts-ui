import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`${axios.custom_base_url}api/class-sections`,formdata);
  },
  update(formdata,id){
    return axios.put(`${axios.custom_base_url}api/class-sections/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`${axios.custom_base_url}api/class-sections/${id}`);
  },
  students(id){
    return axios.get(`${axios.custom_base_url}api/class-sections/${id}/students`);
  },
  all(formData){
    return axios.get(`${axios.custom_base_url}api/class-sections`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`${axios.custom_base_url}api/class-sections/${id}`);
  }
}
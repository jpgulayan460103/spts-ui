import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`/api/attendance`,formdata);
  },
  update(formdata,id){
    return axios.put(`/api/attendance/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`/api/attendance/${id}`);
  },
  all(formData){
    return axios.get(`/api/attendance`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`/api/attendance/${id}`);
  },
  categories(id){
    return axios.get(`/api/subject-categories`);
  }
}
import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`/api/subjects`,formdata);
  },
  update(formdata,id){
    return axios.put(`/api/subjects/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`/api/subjects/${id}`);
  },
  all(formData){
    return axios.get(`/api/subjects`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`/api/subjects/${id}`);
  },
  categories(id){
    return axios.get(`/api/subject-categories`);
  }
}
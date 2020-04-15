import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`${axios.custom_base_url}api/score-items`,formdata);
  },
  update(formdata,id){
    return axios.put(`${axios.custom_base_url}api/score-items/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`${axios.custom_base_url}api/score-items/${id}`);
  },
  students(id){
    return axios.get(`${axios.custom_base_url}api/score-items/${id}/students`);
  },
  subjects(id){
    return axios.get(`${axios.custom_base_url}api/score-items/${id}/subjects`);
  },
  addStudent(class_section_id, formdata){
    return axios.post(`${axios.custom_base_url}api/score-items/${class_section_id}/students`, formdata);
  },
  removeStudent(class_section_id, id){
    return axios.put(`${axios.custom_base_url}api/score-items/${class_section_id}/students/${id}`);
  },
  all(formData){
    return axios.get(`${axios.custom_base_url}api/score-items`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`${axios.custom_base_url}api/score-items/${id}`);
  }
}
import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`/api/class-sections`,formdata);
  },
  update(formdata,id){
    return axios.put(`/api/class-sections/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`/api/class-sections/${id}`);
  },
  students(id){
    return axios.get(`/api/class-sections/${id}/students`);
  },
  subjects(id){
    return axios.get(`/api/class-sections/${id}/subjects`);
  },
  addStudent(class_section_id, formdata){
    return axios.post(`/api/class-sections/${class_section_id}/students`, formdata);
  },
  removeStudent(class_section_id, id){
    return axios.put(`/api/class-sections/${class_section_id}/students/${id}`);
  },
  all(formData){
    return axios.get(`/api/class-sections`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`/api/class-sections/${id}`);
  }
}
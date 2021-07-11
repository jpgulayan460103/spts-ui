import axios from './axios-settings'
import NProgress from 'nprogress';

export default {
  
  add(formdata){
    let {class_section_id, subject_id} = formdata;
    return axios.post(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items`,formdata);
  },
  update(formdata,id){
    let {class_section_id, subject_id} = formdata;
    return axios.put(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${id}`,formdata);
  },
  delete(formdata, id){
    let {class_section_id, subject_id} = formdata;
    return axios.delete(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${id}`);
  },
  students(id){
    return axios.get(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${id}/students`);
  },
  subjects(id){
    return axios.get(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${id}/subjects`);
  },
  addStudent(class_section_id, formdata){
    return axios.post(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${class_section_id}/students`, formdata);
  },
  removeStudent(class_section_id, id){
    return axios.put(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${class_section_id}/students/${id}`);
  },
  all(formData){
    let {class_section_id, subject_id} = formData;
    return axios.get(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items`,{
      params: {
        grading_system_id: formData.grading_system_id,
        unit_id: formData.unit_id
      }
    });
  },
  get(id){
    return axios.get(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${id}`);
  }
}
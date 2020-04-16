import axios from './axios-settings'

export default {
  
  add(formdata){
    let {class_section_id, subject_id} = formdata;
    return axios.post(`${axios.custom_base_url}api/class-sections/${class_section_id}/subjects/${subject_id}/score-items`,formdata);
  },
  update(formdata,id){
    return axios.put(`${axios.custom_base_url}api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${id}`,formdata);
  },
  delete(formdata, id){
    let {class_section_id, subject_id} = formdata;
    return axios.delete(`${axios.custom_base_url}api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${id}`);
  },
  students(id){
    return axios.get(`${axios.custom_base_url}api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${id}/students`);
  },
  subjects(id){
    return axios.get(`${axios.custom_base_url}api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${id}/subjects`);
  },
  addStudent(class_section_id, formdata){
    return axios.post(`${axios.custom_base_url}api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${class_section_id}/students`, formdata);
  },
  removeStudent(class_section_id, id){
    return axios.put(`${axios.custom_base_url}api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${class_section_id}/students/${id}`);
  },
  all(formData){
    let {class_section_id, subject_id} = formData;
    return axios.get(`${axios.custom_base_url}api/class-sections/${class_section_id}/subjects/${subject_id}/score-items`,{
      params: {
        grading_system_id: formData.grading_system_id
      }
    });
  },
  get(id){
    return axios.get(`${axios.custom_base_url}api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${id}`);
  }
}
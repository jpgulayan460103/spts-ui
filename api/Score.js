import axios from './axios-settings'

export default {
  
  add(formdata){
    let {class_section_id, subject_id, score_item_id} = formdata;
    return axios.post(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${score_item_id}/score`,formdata);
  },
  addMultiple(formdata){
    let {class_section_id, subject_id, score_item_id} = formdata;
    return axios.post(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${score_item_id}/score-multiple`,formdata);
  },
  update(formdata,id){
    return axios.put(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${score_item_id}/${id}`,formdata);
  },
  delete(formdata, id){
    let {class_section_id, subject_id, score_item_id} = formdata;
    return axios.delete(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${score_item_id}/${id}`);
  },
  students(id){
    return axios.get(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${score_item_id}/${id}/students`);
  },
  subjects(id){
    return axios.get(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${score_item_id}/${id}/subjects`);
  },
  addStudent(class_section_id, formdata){
    return axios.post(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${score_item_id}${class_section_id}/students`, formdata);
  },
  removeStudent(class_section_id, id){
    return axios.put(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${score_item_id}${class_section_id}/students/${id}`);
  },
  all(formData){
    let {class_section_id, subject_id, score_item_id} = formData;
    return axios.get(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items`,{
      params: {
        grading_system_id: formData.grading_system_id
      }
    });
  },
  get(id){
    return axios.get(`/api/class-sections/${class_section_id}/subjects/${subject_id}/score-items/${score_item_id}/${id}`);
  }
}
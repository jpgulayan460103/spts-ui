import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`${axios.custom_base_url}api/sms/threads`,formdata);
  },
  update(formdata,id){
    return axios.put(`${axios.custom_base_url}api/sms/threads/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`${axios.custom_base_url}api/sms/threads/${id}`);
  },
  all(formData){
    return axios.get(`${axios.custom_base_url}api/sms/threads`,{
      params: formData
    });
  },
  getRecipients(formData){
    return axios.get(`${axios.custom_base_url}api/sms/recipients`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`${axios.custom_base_url}api/sms/threads/${id}`);
  },
  sendSms(id){
    return axios.get(`${axios.custom_base_url}api/sms/threads/${id}`);
  }
}
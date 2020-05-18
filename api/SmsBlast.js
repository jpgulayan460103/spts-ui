import axios from './axios-settings'

export default {
  
  add(formdata){
    return axios.post(`/api/sms/threads`,formdata);
  },
  update(formdata,id){
    return axios.put(`/api/sms/threads/${id}`,formdata);
  },
  delete(id){
    return axios.delete(`/api/sms/threads/${id}`);
  },
  all(formData){
    return axios.get(`/api/sms/threads`,{
      params: formData
    });
  },
  getRecipients(formData){
    return axios.get(`/api/sms/recipients`,{
      params: formData
    });
  },
  get(id){
    return axios.get(`/api/sms/threads/${id}`);
  },
  sendSms(id){
    return axios.get(`/api/sms/threads/${id}`);
  }
}
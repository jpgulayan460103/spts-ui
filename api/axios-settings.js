import axios from 'axios'
import ls from 'local-storage'
import Swal from 'sweetalert2/dist/sweetalert2.js'
import Router from 'next/router'
import NProgress from 'nprogress';

// axios.defaults.baseURL = 'http://spts.test/';
axios.defaults.baseURL = 'https://api.spts.jbdavao.com';
if(ls('user')){
  let token = ls('user').access_token;
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
  axios.interceptors.response.use((response) => {
    NProgress.start();
    return response;
  }, (error) => {
    NProgress.done();
    console.log(error);
    if (error.response && error.response.status == 401) {
      Swal.fire({
        title: 'Unauthorized',
        text: 'You are not logged in or the session may have been expired.',
        icon: 'warning',
        confirmButtonText: 'Click to Login',
        onClose: () => {
          Router.push('/')
        }
      })
      return false;
    }else if (error.response && error.response.status == 403) {
      Swal.fire({
        title: 'Forbidden',
        text: 'You do not have permission to access this page.',
        icon: 'warning',
        confirmButtonText: 'Back to Home',
        onClose: () => {
          Router.push('/')
        }
      })
      return false;
    }else if (error.response && error.response.status >= 500) {
      Swal.fire({
        title: 'Oops...',
        text: 'Something went wrong. Please report this to your technical support',
        icon: 'error',
        confirmButtonText: 'Ok',
      })
      return false;
    }else if (!error.response) {
      Swal.fire({
        title: 'Oops...',
        text: 'Check your internet connection',
        icon: 'error',
        confirmButtonText: 'Ok',
      })
      return false;
    }
    return Promise.reject(error);
  });
}

axios.interceptors.response.use(function (response) {
  NProgress.done();
  return response;
}, function (error) {
  return Promise.reject(error);
});
export default axios;
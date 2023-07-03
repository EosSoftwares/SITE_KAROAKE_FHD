import axios from "axios";

const axiosInstance = axios.create({
	baseURL: 'https://api-karaoke-fhd.azurewebsites.net/api/v1/',
});

axiosInstance.interceptors.request.use(
  function(config) {
    const token = window.localStorage.token;
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(response => {
  return response
}, error => {
  return error
});

export const api = {
	get(endpoint) {
		return axiosInstance.get(endpoint);
	},

	post(endpoint, body){
		return axiosInstance.post(endpoint, body);
	},
	
	delete(endpoint) {
		return axiosInstance.delete(endpoint)
	},
	
	put(endpoint, body){
		return axiosInstance.put(endpoint, body);
	},
	
  patch(endpoint, body){
		return axiosInstance.patch(endpoint, body);
	},

  apikey: 'c23232IlIl7d3-f804-5577-2253-ytr33qe34210'
}

export function getCep(cep){
	return axios.get(`https:viacep.com.br/ws/${cep}/json/`)
}

export function generateUUID() { // Public Domain/MIT
  var d = new Date().getTime();//Timestamp
  var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now()*1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16;//random number between 0 and 16
      if(d > 0){//Use timestamp until depleted
          r = (d + r)%16 | 0;
          d = Math.floor(d/16);
      } else {//Use microseconds since page-load if supported
          r = (d2 + r)%16 | 0;
          d2 = Math.floor(d2/16);
      }
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
  });
}
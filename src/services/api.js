import axios from "axios";
const baseUrl = process.env.VUE_APP_API_URL;

const ApiService = {
  async auth() {
    return axios.get(`${baseUrl}/oauth2/token?client_id=${process.env.VUE_APP_API_ID}&api_key=${process.env.VUE_APP_API_KEY}`).catch(() => {
      throw new Error(`API Authorization failed`);
    });
  },

  async query(resource, params) {
    const jwt = localStorage.getItem("access_token");
    return axios.get(`${baseUrl}/${resource}`, {
      headers: { Authorization: `Bearer ${jwt}` }, params
    }).catch(error => {
      throw new Error(`ApiService ${error}`);
    });
  },

  async get(resource) {
    const jwt = localStorage.getItem("access_token");
    return axios.get(`${baseUrl}/${resource}`, {
      headers: { Authorization: `Bearer ${jwt}` }
    }).catch(error => {
      throw new Error(`ApiService ${error}`);
    });
  },

};

export default ApiService;

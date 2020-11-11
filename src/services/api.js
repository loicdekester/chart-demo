import axios from "axios";
const baseUrl = process.env.VUE_APP_API_URL;

const ApiService = {
  /**
   * API call to retrieve token for subsequent protected calls.
   * API_ID and API_KEY are from the website demo https://support.fastsensor.com/en/article/development-quickstart
   */
  async auth() {
    return axios.get(`${baseUrl}/oauth2/token?client_id=${process.env.VUE_APP_API_ID}&api_key=${process.env.VUE_APP_API_KEY}`).catch(() => {
      throw new Error(`API Authorization failed`);
    });
  },

  /**
   * Default HTTP query
   * @param {string} resource - API endpoint
   * @param {object} params - parameters for the call
   */
  async query(resource, params) {
    const jwt = localStorage.getItem("access_token");
    return axios.get(`${baseUrl}/${resource}`, {
      headers: { Authorization: `Bearer ${jwt}` }, params
    }).catch(error => {
      throw new Error(`ApiService ${error}`);
    });
  },

  /**
   * Default HTTP get call
   * @param {string} resource - API endpoint
   */
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

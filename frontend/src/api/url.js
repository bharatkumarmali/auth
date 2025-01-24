const BASE_URL = 'http://localhost:3000/api/v1';

const api = {
  //-----------------------------------login / logout
  login: `${BASE_URL}/user/login`,

  //-----------------------------------register
  register: `${BASE_URL}/user/register`,

  //-----------------------------------logout
  logout: `${BASE_URL}/user/logout`,

  //-----------------------------------user
  user_details: `${BASE_URL}/user/details`,

  //-----------------------------------user update
  user_update_details: `${BASE_URL}/user/update-details`,

  //-----------------------------------user update photo
  user_update_photo: `${BASE_URL}/user/update-avatar`,
};

export default api;

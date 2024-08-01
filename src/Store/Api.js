import axios from 'axios';

const api = axios.create({
  baseURL: 'http://lab.pixel6.co/api',
  headers: {
    'Content-Type': 'application/json',
  },
});
export const verifyPAN = (panNumber) => {
  return api.post('/verify-pan.php', { panNumber });
};

export const getPostcodeDetails = (postcode) => {
  return api.post('/get-postcode-details.php', { postcode });
};

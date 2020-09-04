import axios from 'axios';

const instance = axios.create({
    baseURL: 'https://react-my-burger-6f77b.firebaseio.com/'
});  

export default instance;

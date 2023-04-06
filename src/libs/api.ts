import axios, { AxiosError } from 'axios'
import {parseCookies} from 'nookies'
import { types } from 'util';

const cookies = parseCookies();
export const api = axios.create({
    baseURL:'http://localhost:3333',
    headers: {
        Authorization: `Bearer ${cookies['@app.token']}`
    }
})
interface ErrorToken {
    code:string
}
//espera a resposta do back-end
api.interceptors.response.use(response => {
   return response; 
}, (error:AxiosError<ErrorToken>) => {
   if(error.response?.status === 401){
    if(error.response.data?.code === 'token.expired'){
        // renovar o token
    }else {
        //deslogar o usuário
    }
   }
})
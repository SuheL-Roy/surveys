
import {createStore} from 'vuex';
import axiosClient from '../axios';

const tempSurveys = [
    {
        "id": 1,
        "title": "welcome to shark world",
        "status":false,
        "image_url": "https://via.placeholder.com/600/92c952",
        "description":"1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Minibus Bonum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
        questions:[
                {
                "id": 1,
                "title": "delectus aut autem",
                "completed": false
                },
        ]
    },
    {
        "id": 2,
        "title": "welcome to shark world",
        "status":true,
        "image_url": "https://via.placeholder.com/600/92c952",
        "description":"1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Minibus Bonum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
        questions:[
            {
            "id": 2,
            "title": "delectus aut autem",
            "completed": false
            },
    ]
    },
    {
        "id": 3,
        "title": "welcome to shark world",
        "image_url": "https://via.placeholder.com/600/92c952",
        "description":"1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Minibus Bonum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
        questions:[
            {
            "id": 1,
            "title": "delectus aut autem",
            "completed": false
            },
    ]
    },
    {
        "id": 4,
        "title": "welcome to shark world",
        "status":false,
        "image_url": "https://via.placeholder.com/600/92c952",
        "description":"1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Minibus Bonum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
        questions:[]
    },
    {
        "id": 5,
        "title": "welcome to shark world",
        "status":false,
        "image_url": "https://via.placeholder.com/600/92c952",
        "description":"1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Minibus Bonum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
        questions:[]
    },
    {
        "id": 6,
        "title": "welcome to shark world",
        "status":true,
        "image_url": "https://via.placeholder.com/600/92c952",
        "description":"1500s is reproduced below for those interested. Sections 1.10.32 and 1.10.33 from de Minibus Bonum et Malorum by Cicero are also reproduced in their exact original form, accompanied by English versions from the 1914 translation by H. Rackham.",
        questions:[]
    },

    ]

const store = createStore({
    state:{
        user:{
            data:{ },
            token:sessionStorage.getItem('TOKEN'),
        },
        surveys:[...tempSurveys],
    },
    getters:{},
    actions:{
        register({commit},user){
            return axiosClient.post('/register',user)
            .then(({data})=>{
                commit('setUser',data);
                return data;
            })
        },
        login({commit},user){
            return axiosClient.post('/login',user)
            .then(({data})=>{
                commit('setUser',data);
                return data;
            })
            
        },
        logout({commit}){
            return axiosClient.post('/logout')
            .then(response => {
                commit('logout')
                return response;
            })
        }
    },
    mutations:{
        logout:state=>{
            state.user.data={};
            state.user.token=null;
        },
        setUser:(state,userData)=>{
            state.user.token = userData.token;
            state.user.data = userData.user;
            sessionStorage.setItem("TOKEN",userData.token);
        }
    },
    modules:{},
})   

export default store;




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
                 id: 1,
                 type: "select",
                 question : "From which country are you",
                 description: null,
                  data: {
                      options:[
                          {uuid:"d1d445b0-99ea-11ec-b909-0242ac120002",text:"A"},
                          {uuid:"a25c731a-99eb-11ec-b909-0242ac120002",text:"b"},
                          {uuid:"dbcc1254-57d1-42b6-8dc5-74e3c9b2f618",text:"c"},
                          {uuid:"2dfdbec7-ef24-4f21-98d7-9a05060bd2f9",text:"d"}
                      ]
                  }
                },
                {
                    id: 2,
                    type: "textarea",
                    question : "From which country are you",
                    description: null,
                     data: {
                         options:[
                             {uuid:"d1d445b0-99ea-11ec-b909-0242ac120002",text:"E"},
                             {uuid:"a25c731a-99eb-11ec-b909-0242ac120002",text:"F"},
                             {uuid:"dbcc1254-57d1-42b6-8dc5-74e3c9b2f618",text:"G"},
                             {uuid:"2dfdbec7-ef24-4f21-98d7-9a05060bd2f9",text:"H"}
                         ]
                     }
                   },
                   {
                    id: 3,
                    type: "radio",
                    question : "From which country are you",
                    description: null,
                     data: {
                         options:[
                             {uuid:"d1d445b0-99ea-11ec-b909-0242ac120002",text:"I"},
                             {uuid:"a25c731a-99eb-11ec-b909-0242ac120002",text:"J"},
                             {uuid:"dbcc1254-57d1-42b6-8dc5-74e3c9b2f618",text:"K"},
                             {uuid:"2dfdbec7-ef24-4f21-98d7-9a05060bd2f9",text:"L"}
                         ]
                     }
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
                id: 1,
                type: "checkbox",
                question : "From which country are you",
                description: "welcome to survey",
                data: {
                    options:[]
                },
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
                id: 1,
                type: "textarea",
                question : "From which country are you",
                description: "welcome to survey",
                data: {
                    options:[]
                },
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
        questions:[
            {
                id: 1,
                type: "textarea",
                question : "From which country are you",
                description: null,
                data: {
                     options:[
                         {uuid:"d1d445b0-99ea-11ec-b909-0242ac120002",text:"BD"},
                         {uuid:"a25c731a-99eb-11ec-b909-0242ac120002",text:"GE"},
                         {uuid:"dbcc1254-57d1-42b6-8dc5-74e3c9b2f618",text:"Fin"},
                         {uuid:"2dfdbec7-ef24-4f21-98d7-9a05060bd2f9",text:"US"}
                     ]
                 },
               },
        ]
    },

    ]

const store = createStore({
    state:{
        user:{
            data:{ },
            token:sessionStorage.getItem('TOKEN'),
        },
        surveys:[...tempSurveys],
        questionTypes: ["text", "select", "radio", "checkbox", "textarea"],
    },
    getters:{},
    actions:{
        saveSurvey({ commit },survey){
            delete survey.image_url;
                 let response;
                 if(survey.id){
                     response = axiosClient
                     .put(`/survey/${survey.id}`,survey)
                     .then((res)=>{
                         commit('updateSurvey',res.data);
                         return res;
                     })
                 }else{
                     response = axiosClient.post("/survey",survey).then((res)=>{
                            commit("saveSurvey",res.data);
                            return res;
                     });
                 }
                 return response;
        },
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
        saveSurvey:(state,survey)=>{
            state.surveys =[...state.surveys,survey.data];
        },
        updateSurvey:(state,survey)=>{
          state.surveys = state.surveys.map((s)=>{
              if(s.id == survey.data.id){
              return survey.data;
              }
              return s;
          })
        },
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



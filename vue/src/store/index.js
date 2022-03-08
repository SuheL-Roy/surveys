
import {createStore} from 'vuex';
import axiosClient from '../axios';


const store = createStore({
    state:{
        user:{
            data:{ },
            token:sessionStorage.getItem('TOKEN'),
        },
        dashboard:{
            loading:false,
            data:{}

        },
        currentSurvey: {
            data: {},
            loading: false,
        },
        surveys:{
            loading:false,
            links:[],
            data:[],
        },
        questionTypes: ["text", "select", "radio", "checkbox", "textarea"],

        Notification:{
            show:false,
            type:null,
            message:null
        }
    },
    getters:{},
    actions:{
        getDashboardData({commit}){
             commit('dashboardLoading',true);
             return axiosClient.get('/dashboard')
             .then((res)=>{
                 commit('dashboardLoading',false);
                 commit('setDashBoardData',res.data);
                 return res
             }).catch((err)=>{
                commit('dashboardLoading',false);
                return err;
             })
        },
        getSurvey({commit},id){
            commit("setCurrentSurveyLoading", true);
            return axiosClient
              .get(`/survey/${id}`)
              .then((res) => {
                commit("setCurrentSurvey", res.data);
                commit("setCurrentSurveyLoading", false);
                return res;
              })
              .catch((err) => {
                commit("setCurrentSurveyLoading", false);
                throw err;
              });  


        },

        getSurveys({ commit }, {url = null} = {}) {
            commit('setSurveysLoading', true)
            url = url || "/survey";
            return axiosClient.get(url).then((res) => {
              commit('setSurveysLoading', false)
              commit("setSurveys", res.data);
              return res;
            });
          },
        saveSurvey({ commit },survey){
            //delete survey.image_url;
                 let response;
                 if(survey.id){
                     response = axiosClient
                     .put(`/survey/${survey.id}`,survey)
                     .then((res)=>{
                         commit('setCurrentSurvey',res.data);
                         return res;
                     })
                 }else{
                     response = axiosClient.post("/survey",survey).then((res)=>{
                            commit("setCurrentSurvey",res.data);
                            return res;
                     });
                 }
                 return response;
        },
        getSurveyBySlug({commit},slug){
          commit('setCurrentSurveyLoading',true);
          return axiosClient.get(`/survey-by-slug/${slug}`)
          .then((res)=>{
            commit('setCurrentSurvey',res.data);  
            commit('setCurrentSurveyLoading',false);
            return res;
          }).catch((err)=>{
            commit('setCurrentSurveyLoading',false);
            throw err
          })
        },
        deleteSurvey({ dispatch }, id) {
            return axiosClient.delete(`/survey/${id}`).then((res) => {
             // dispatch('getSurveys')
              return res;
            });
          },
          saveSurveyAnswer({commit}, {surveyId, answers}) {
            return axiosClient.post(`/survey/${surveyId}/answer`, {answers});
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
        dashboardLoading:(state,loading)=>{
          state.dashboard.loading = loading;
        },
        setDashBoardData:(state,data)=>{
            state.dashboard.data = data;
            console.log(data);
        },
        setCurrentSurveyLoading: (state, loading) => {
            state.currentSurvey.loading = loading;
          },
          setCurrentSurvey: (state, survey) => {
            state.currentSurvey.data = survey.data;
            // console.log(currentSurvey.data);
          },
          setSurveysLoading: (state, loading) => {
            state.surveys.loading = loading;
          },
          setSurveys: (state, surveys) => {
           state.surveys.links = surveys.meta.links;
            state.surveys.data = surveys.data;
          //  console.log(surveys.data);
          },

          notify:(state,{message,type})=>{
               state.Notification.show = true;
               state.Notification.type = type;
               state.Notification.message = message;
               setTimeout(()=>{
                   state.Notification.show = false;
               },3000);
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



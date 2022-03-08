
import {createRouter, createWebHistory} from 'vue-router';
import Dashboard from '../view/Dashboard.vue'
import Login from '../view/Login.vue'
import Register from '../view/Register.vue'
import DefaultLayout from '../components/DefaultLayout.vue'
import surveys from '../view/surveys.vue';
import SurveyView from '../view/SurveyView.vue'
import store from '../store';
import AuthLayout from '../components/Authlayout.vue';
import SurveyPublic from '../view/SurveyPublic.vue';

const routes=[
    {
        path:'/',
        redirect:'/dashboard',
        meta:{requiresAuth:true},
        component:DefaultLayout,
        children: [
            {
                path:'/dashboard',
                name:'Dashboard',
                component:Dashboard,

            },

            {
                path:'/surveys',
                name:'surveys',
                component: surveys
            },
            {
                path:'/surveys/create',
                name:'SurveyCreate',
                component:SurveyView
            },
            {
                path:'/surveys/:id',
                name:'SurveyView',
                component:SurveyView
            }
        ]
    },
    {
        path: "/view/survey/:slug",
        name: 'SurveyPublic',
        component: SurveyPublic
    },
    {
       path:'/Auth',
       name:'Auth',
       component: AuthLayout,
       meta:{isGuest:true},
       children:[
        {
            path:'/login',
            name:'Login',
            component:Login
        },
        {
            path:'/register',
            name:'Register',
            component:Register
        },
           
       ]
    },
   

];

const router = createRouter({
    history:createWebHistory(),
    routes
})

router.beforeEach((to,from,next)=>{
    if(to.meta.requiresAuth && !store.state.user.token){
        next({name:'Login'});
    }else if(store.state.user.token &&(to.meta.isGuest)){
        next({name:'Dashboard'});
    }else{
        next()
    }

})

export default router;
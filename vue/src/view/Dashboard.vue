<template>
    <PageComponent title="Dashboard">
        <div v-if="loading" class="flex justify-center">Loading.......</div>
        <div
            v-else
            class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 text-gray-700"
        >
            <div
                class="bg-white shadow-md p-3 text-center flex flex-col order-1 lg:order-2"
                style="animation-delay: 0.1s"
            >
                <h3 class="text-2xl font-semibold">Total Surveys</h3>
                {{ data.total }}
            </div>
            <div
                class="bg-white shadow-md p-3 text-center flex flex-col order-2 lg:order-4"
                style="animation-delay: 0.2s"
            >
                <h3 class="text-2xl font-semibold">Total Answers</h3>
                {{ data.totalAnswers }}
            </div>
            <div
                class="row-span-2 animate-fade-in-down text-center order-3 lg:order-1 bg-white shadow-md p-4"
            >
                <h3 class="text-2xl font-semibold">Latest Surveys</h3>
                <img
                    :src="data.latest.image_url"
                    class="w-[240px] mx-auto"
                    alt=""
                />
                <h3 class="font-bold text-xl mb-3">{{ data.latest.title }}</h3>
                <div class="flex justify-between text-sm mb-1">
                    <div>Upload Date:</div>
                    <div>{{ data.latest.created_at }}</div>
                </div>
                <div class="flex justify-between text-sm mb-3">
                    <div>Answers:</div>
                    <div>{{ data.totalAnswers }}</div>
                </div>
                <div class="flex justify-between">
                    <router-link
                        :to="{
                            name: 'SurveyView',
                            params: { id: data.latest.id },
                        }"
                        class="flex py-2 px-4 border border-transparent text-sm rounded-md text-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                            />
                        </svg>
                        Edit Survey
                    </router-link>
                    <button
                    class="flex py-2 px-4 border border-transparent text-sm rounded-md text-indigo-500 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            class="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            stroke-width="2"
                        >
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                        </svg>
                        view answers
                    </button>
                </div>
            </div>
            <div
                class="bg-white shadow-md p-3 row-span-2 order-4 lg:order-3"
                style="animation-delay: 0.3s"
            >
             <div class="flex justify-between t items-center mb-3 px-2">
                 <h3 class="text-2xl  font-semibold">Latest Answers</h3>
                 <a href="javascript:void(0)"
                 class="text-sm text-blue-500 hover:decoration-blue-500"
                 >
                  View all
                 </a>

             </div>
             <a 
             href="#"
             v-for="answer of data.latestAnswers"
             :key="answer.id"
             class="black p-2 hover:bg-gray-100/90"
             >
             <div class="font-semibold">  {{answer.survey.title}} </div>
               <small>
                   Answer Made at:
                   <i>{{answer.end_date}}</i>
               </small>
             </a>

            
            
            </div>
        </div>
    </PageComponent>
</template>

<script setup>
import PageComponent from "../components/PageComponent.vue";
import { computed } from "vue";
import { useStore } from "vuex";

const store = useStore();

const loading = computed(() => store.state.dashboard.loading);
const data = computed(() => store.state.dashboard.data);

store.dispatch("getDashboardData");
</script>

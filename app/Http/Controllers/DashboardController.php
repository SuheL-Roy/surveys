<?php

namespace App\Http\Controllers;

use App\Http\Resources\SurveyAnswerResource;
use App\Http\Resources\SurveyResource;
use App\Models\Survey;
use App\Models\SurveyAnswere;
use Illuminate\Http\Request;

class DashboardController extends Controller
{
    public function index(Request $request){
         
        $user = $request->user();

        $total = Survey::query()->where('user_id', $user->id)->count();

        $latest = Survey::query()->where('user_id',$user->id)->latest('created_at')->first();

        $totalAnswers = SurveyAnswere::query()
            ->join('surveys', 'survey_answeres.survey_id', '=', 'surveys.id')
            ->where('surveys.user_id', $user->id)
            ->count();

            $latestAnswers = SurveyAnswere::query()
            ->join('surveys', 'survey_answeres.survey_id', '=', 'surveys.id')
            ->where('surveys.user_id', $user->id)
            ->orderBy('end_date', 'DESC')
            ->limit(5)
            ->getModels('survey_answeres.*');    

            return[
                'total' => $total,
                'latest' => $latest ? new SurveyResource($latest):null,
                'totalAnswers'=>$totalAnswers,
                'latestAnswers' =>SurveyAnswerResource::collection(($latestAnswers))
            ];
    }

    
}

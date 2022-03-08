<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class SurveyQuestionAnswere extends Model
{
    use HasFactory;
    protected $fillable = ['survey_question_id', 'survey_answeres_id', 'answer'];
}

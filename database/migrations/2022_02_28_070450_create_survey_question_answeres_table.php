<?php

use App\Models\SurveyAnswere;
use App\Models\SurveyQuestion;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('survey_question_answeres', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(SurveyQuestion::class,"survey_question_id");
            $table->foreignIdFor(SurveyAnswere::class,"survey_answeres_id");
            $table->text('answer');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('survey_question_answeres');
    }
};

<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreSurveyAnswerRequest;
use App\Models\Survey;
use App\Http\Requests\StoreSurveyRequest;
use App\Http\Requests\UpdateSurveyRequest;
use App\Http\Resources\SurveyResource;
use App\Models\SurveyAnswere;
use App\Models\SurveyQuestion;
use App\Models\SurveyQuestionAnswere;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;

class SurveyController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index(Request $request)
    {
        $user = $request->user();

       // return SurveyResource::collection(Survey::where('user_id', $user->id)->paginate()); 
       return SurveyResource::collection(Survey::where('user_id', $user->id)->orderBy('created_at', 'DESC')->paginate(10));

    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \App\Http\Requests\StoreSurveyRequest  $request
     * @return \Illuminate\Http\Response
     */
    public function store(StoreSurveyRequest $request)
    {
        $data = $request->validated();

        // Check if image was given and save on local file system
        if (isset($data['image'])) {
            $relativePath  = $this->saveImage($data['image']);
            $data['image'] = $relativePath;
        }

        $survey = Survey::create($data);

     //  Create new questions
        foreach ($data['questions'] as $question) {
            $question['survey_id'] = $survey->id;
            $this->createQuestion($question);
        }

        return new SurveyResource($survey);
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function show(Survey $survey,Request $request)
    {
        $user = $request->user();
        if($user->id !== $survey->user_id){
            return abort(403,'Unauthorized action'); 
        }
        return new SurveyResource($survey);
    }
    public function showForGuest( Survey $survey)
    {
        // $user = $request->user();
        // if($user->id !== $survey->user_id){
        //     return abort(403,'Unauthorized action'); 
        // }
        return new SurveyResource($survey);
    }

    public function storeAnswer(StoreSurveyAnswerRequest $request, Survey $survey){
        $validated = $request->validated();

        $surveyAnswer = SurveyAnswere::create([
            'survey_id' => $survey->id,
            'start_date' => date('Y-m-d H:i:s'),
            'end_date' => date('Y-m-d H:i:s'),
        ]);

        foreach ($validated['answers'] as $questionId => $answer) {
            $question = SurveyQuestion::where(['id' => $questionId, 'survey_id' => $survey->id])->get();
            if (!$question) {
                return response("Invalid question ID: \"$questionId\"", 400);
            }
            $data = [
                'survey_question_id' => $questionId,
                'survey_answeres_id' => $surveyAnswer->id,
                'answer' => is_array($answer) ? json_encode($answer) : $answer
            ];

            $questionAnswer = SurveyQuestionAnswere::create($data);

        }

        return response($questionAnswer, 201);

    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \App\Http\Requests\UpdateSurveyRequest  $request
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function update(UpdateSurveyRequest $request, Survey $survey)
    {
       /// $survey->update($request->validated());
       $data = $request->validated();

        // Check if image was given and save on local file system
        if (isset($data['image'])) {
            $relativePath = $this->saveImage($data['image']);
            $data['image'] = $relativePath;

            // If there is an old image, delete it
            if ($survey->image) {
                $absolutePath = public_path($survey->image);
                File::delete($absolutePath);
            }
        }
        $survey->update($data);
        //get the plain array from existing question
        $existingIds = $survey->questions()->pluck('id')->toArray();

        $newIds = Arr::pluck($data['questions'],'id');

        $toDelete = array_diff($existingIds,$newIds);

        $toAdd = array_diff($newIds,$existingIds);
         
        SurveyQuestion::destroy($toDelete);

         foreach ($data['questions'] as $question) {
            if (in_array($question['id'], $toAdd)) {
                $question['survey_id'] = $survey->id;
                $this->createQuestion($question);
            }
        }
        $questionMap = collect($data['questions'])->keyBy('id');
        foreach($survey->questions as $question){
            if(isset($questionMap[$question->id])){
                $this->updateQuestion($question,$questionMap[$question->id]);
            }
        }

        return new SurveyResource(($survey));
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Models\Survey  $survey
     * @return \Illuminate\Http\Response
     */
    public function destroy(Survey $survey,Request $request)
    {
        $user = $request->user();
        if($user->id !== $survey->user_id){
            return abort(403,'Unauthorized action'); 
        }
        $survey->delete();

        // If there is an old image, delete it
        if ($survey->image) {
            $absolutePath = public_path($survey->image);
            File::delete($absolutePath);
        }

        return response('', status:204);
    }

    private function saveImage($image){
        // Check if image is valid base64 string
        if (preg_match('/^data:image\/(\w+);base64,/', $image, $type)) {
            // Take out the base64 encoded text without mime type
            $image = substr($image, strpos($image, ',') + 1);
            // Get file extension
            $type = strtolower($type[1]); // jpg, png, gif

            // Check if file is an image
            if (!in_array($type, ['jpg', 'jpeg', 'gif', 'png'])) {
                throw new \Exception('invalid image type');
            }
            $image = str_replace(' ', '+', $image);
            $image = base64_decode($image);

            if ($image === false) {
                throw new \Exception('base64_decode failed');
            }
        } else {
            throw new \Exception('did not match data URI with image data');
        }

        $dir = 'images/';
        $file = Str::random() . '.' . $type;
        $absolutePath = public_path($dir);
        $relativePath = $dir . $file;
        if (!File::exists($absolutePath)) {
            File::makeDirectory($absolutePath, 0755, true);
        }
        file_put_contents($relativePath, $image);

       return $relativePath;
    }

    private function createQuestion($data)
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }
        $validator = Validator::make($data, [
            'question' => 'required|string',
            'type' => ['required', Rule::in([
                Survey::TYPE_TEXT,
                Survey::TYPE_TEXTAREA,
                Survey::TYPE_SELECT,
                Survey::TYPE_RADIO,
                Survey::TYPE_CHECKBOX,
            ])],
            'description' => 'nullable|string',
            'data' => 'present',
            'survey_id' => 'exists:App\Models\Survey,id'
        ]);

        return SurveyQuestion::create($validator->validated());
    }

    private function updateQuestion(SurveyQuestion $question, $data)
    {
        if (is_array($data['data'])) {
            $data['data'] = json_encode($data['data']);
        }
        $validator = Validator::make($data, [
            'id' => 'exists:App\Models\SurveyQuestion,id',
            'question' => 'required|string',
            'type' => ['required', Rule::in([
                Survey::TYPE_TEXT,
                Survey::TYPE_TEXTAREA,
                Survey::TYPE_SELECT,
                Survey::TYPE_RADIO,
                Survey::TYPE_CHECKBOX,
            ])],
            'description' => 'nullable|string',
            'data' => 'present',
        ]);

        return $question->update($validator->validated());
    }
}

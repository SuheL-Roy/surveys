<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Auth\Passwords\PasswordBroker;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
//use Illuminate\Support\Facades\Password;
use Illuminate\Validation\Rules\Password;
use Laravel\Sanctum\HasApiTokens;

class AuthController extends Controller
{
    public function register(Request $request){
        $data = $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|string|unique:users,email',
            //'password' => 'required|confirmed',
            'password' => [
                'required',
                'confirmed',
                Password::min(8)->mixedCase()->numbers()->symbols()
                
            ]

        ]);

       $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password'=> bcrypt($data['password'])
        ]);

        $token = $user->createToken('main')->plainTextToken;

        return response([
            'user'=> $user,
            'token'=>$token
        ]);


     }

     public function login(Request $request){
        
        $credentials = $request->validate([
            'email' => 'required|email|string|exists:users,email',
            'password' => [
                'required'
            ],
              'remember' => 'boolean'
            ]);

            $remember = $credentials['remember'] ?? false;

            unset($credentials['remember']);

            if(!Auth::attempt($credentials, $remember)){
                return response([
                    'error' => 'the Provided credentials are not correct'
                ],422);
            }

           $user = Auth::user();
         /** @var \App\Models\MyUserModel $user **/
           $token = $user->createToken('main')->plainTextToken;
            
            return response([
                'user' => $user,
                'token' => $token
            ],200);
      
   
    }

    public function logout(Request $request){
    
      //$user = Auth::user();
      /** @var \App\Models\MyUserModel $user **/
      Auth::user()->tokens->each(function($token, $key) {
        $token->delete();
    });
   return response(['message'=> 'success'], 200);
    
    }
  
}

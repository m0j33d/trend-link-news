<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateNewsPreferencesRequest;
use App\Http\Requests\UpdateUserRequest;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Arr;

class UsersController extends Controller
{
    /**
     * Gets Authenticated User Information
     *
     * @return JsonResponse
     */
    public function index()
    {
        return response()->json([
            "status" => true,
            "message" => "User Resource Fetched.",
            "data" => UserResource::make(\auth('api')->user())
        ]);
    }


    /**
     * Updates User Information
     *
     * @return JsonResponse
     */
    public function update(UpdateUserRequest $request)
    {
        $user = \auth('api')->user();

        $user->update($request->validated());

        return response()->json([
           "status" => true,
           "message" => "User Updated.",
           "data" => UserResource::make($user)
        ]);
    }


    /**
     * Updates Users News Preferences
     *
     * @return JsonResponse
     */
    public function updateNewsPreferences(UpdateNewsPreferencesRequest $request)
    {
        $user = \auth('api')->user();

        $payload = $request->validated();

        $preferences = $user->preferences ?? [];

        $preferences["sources"] =  $payload["sources"] ?? [];
        $preferences["categories"] = $payload["categories"] ?? [];
        $preferences["authors"] =  $payload["authors"] ?? [];

        $user->update([
            "preferences" => $preferences
        ]);

        return response()->json([
            "status" => true,
            "message" => "Preferences Updated.",
            "data" => $user->preferences
        ]);
    }

}

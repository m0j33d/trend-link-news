<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\Auth;

class AuthenticatedSessionController extends Controller
{
    /**
     * Handle an incoming authentication request.
     *
     * @return JsonResponse
     */
    public function store(LoginRequest $request): JsonResponse
    {
        $request->authenticate();

        $token = $request->user()->createToken('access_token')->accessToken;

        $user = $request->user();
        Auth::login($user);

        return response()->json([
            "status" => true,
            "message" => "Login Successful",
            "token" => $token,
            "user" => UserResource::make($user)
        ]);
    }

    /**
     * Destroy an authenticated session.
     *
     * @return JsonResponse
     */
    public function destroy(Request $request): JsonResponse
    {
        if (Auth::guard('api')->check()) {

            $request->user()->token()->revoke();

            return response()->json([
                "status" => true,
                "message" => "Logout successful"
            ]);
        }

        return response()->json([
            "status" => false,
            "message" => "User is not logged in"
        ]);

    }
}

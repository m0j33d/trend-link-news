<?php

use App\Http\Controllers\NewsController;
use App\Http\Controllers\UsersController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group([ "middleware" => "auth:api"],

    function (){
        Route::get('/fetch', [NewsController::class, 'index'])->name('news.fetch');
        Route::get('/fetch_cached_articles', [NewsController::class, 'fetchCachedArticles'])->name('news.fetch.cached');

        Route::apiResource('/user', UsersController::class)->only(['update', 'index']);
        Route::post('/user_preference', [UsersController::class, 'updateNewsPreferences'])->name('user.update.preference');

});

require __DIR__.'/auth.php';

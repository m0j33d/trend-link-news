<?php

namespace App\Http\Controllers;

use App\Http\Requests\GetNewsRequest;
use App\Services\NewsService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;

class NewsController extends Controller
{
    /**
     * Fetches News Article for user.
     *
     * @return JsonResponse
     */
    public function index(GetNewsRequest $request)
    {
        // Get All Query Params
        $keyword = $request->query('keyword');
        $sources = $request->query('sources');
        $categories = $request->query('categories');
        $from = $request->query('from');
        $to = $request->query('to');

        $news = new NewsService();

        //convert source to array to filter the sources selected if present
        $source_array = explode(",", $sources);

        try{
            if(is_null($sources) || in_array('newsapi', $source_array))
                $articlesNewsAPI = $news->searchNewsApiArticles($keyword, $categories, $from, $to);

            if(is_null($sources) || in_array('guardian', $source_array))
                $articlesGuardian = $news->searchGuardianArticles($keyword, $categories, $from, $to);

            if(is_null($sources) || in_array('nytimes', $source_array))
                $articleNYTimes = $news->searchNYTimesArticles($keyword, $categories, $from, $to);

        }catch (\Throwable $error){
            logger($error);
        }


        //Format the articles from the api to same format
        $formatted_articles = $news->formatAndAggregateArticles
        (
            newsApiArticles: $articlesNewsAPI['articles'] ?? [],
            guardianArticles: $articlesGuardian['response']['results'] ?? [],
            nyTimesArticles: $articleNYTimes['response']['docs'] ?? []
        );

        return response()->json($formatted_articles);

    }


    /**
     * Fetches Cached News Article for user.
     *
     * @return LengthAwarePaginator | JsonResponse
     */
    public function fetchCachedArticles()
    {
        $unique_identifier = base64_encode(auth()->id());

        $articles = Cache::get("$unique_identifier:articles");

        //validates users input is numeric
        $page = is_numeric(request('page')) ? request('page') :  1;

        $articles = NewsService::paginateArticles(
            articles: $articles,
            page: $page,
        );

        return response()->json($articles);

    }


}


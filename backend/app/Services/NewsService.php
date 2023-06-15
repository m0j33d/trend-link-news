<?php

namespace App\Services;

use Carbon\Carbon;
use GuzzleHttp\Client;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;


class NewsService
{
    protected $newsApiClient;
    protected $newsApiKey;
    protected $guardianApiClient;
    protected $guardianApiKey;
    protected $nytApiClient;
    protected $nytApiKey;

    public function __construct()
    {
        $this->newsApiClient = new Client(['base_uri' => 'https://newsapi.org/v2/']);
        $this->newsApiKey = config('services.newsapi.key');

        $this->guardianApiClient = new Client(['base_uri' => 'https://content.guardianapis.com/']);
        $this->guardianApiKey = config('services.guardian.key');

        $this->nytApiClient = new Client(['base_uri' => 'https://api.nytimes.com/']);
        $this->nytApiKey = config('services.nyt.key');

    }

    /**
     * Searches articles on NewsAPI
     *
     */
    public function searchNewsApiArticles($keyword='', $categories = null, $from = null, $to = null)
    {
        $query =
            [
                'q' => $keyword,
                'language' => 'en',
                'apiKey' => $this->newsApiKey,
            ];

        if (!empty($categories)) {
            $query['category'] = $categories;
        }

        if (!empty($from)) {
            $query['from'] = $from;
        }

        if (!empty($to)) {
            $query['to'] = $to;
        }

        $response = $this->newsApiClient->get('top-headlines', ['query' => $query]);

        return json_decode($response->getBody()->getContents(), true);
    }

    /**
     * Searches articles on Guardian
     *
     */
    public function searchGuardianArticles($keyword, $categories = null, $from = null, $to = null)
    {
        $query = [
            'q' => $keyword,
            'api-key' => $this->guardianApiKey,
        ];

        if (!empty($categories)) {
            $query['category'] = $categories;
        }

        if (!empty($from)) {
            $query['from-date'] = $from;
        }

        if (!empty($to)) {
            $query['to-date'] = $to;
        }

        $response = $this->guardianApiClient->get('search', ['query' => $query]);

        return json_decode($response->getBody()->getContents(), true);
    }

    /**
     * Searches articles on New York Times
     *
     */
    public function searchNYTimesArticles($keyword, $categories = null, $from = null, $to = null)
    {
        $query = [
            'q' => $keyword,
            'api-key' => $this->nytApiKey,
        ];

        if (!empty($categories)) {
            $query['category'] = $categories;
        }

        if (!empty($from)) {
            $query['begin_date'] = $from;
        }

        if (!empty($to)) {
            $query['end_date'] = $to;
        }

        https://api.nytimes.com/svc/search/v2/articlesearch.json?fq=sport&facet_field=news_desk&facet=true&api-key=MiEWA5YpzfPyQiTugvWL6kgn4YaTlvrm
        $response = $this->nytApiClient->get('/svc/search/v2/articlesearch.json', ['query' => $query]);

        return json_decode($response->getBody()->getContents(), true);
    }


    public static function formatAndAggregateArticles($newsApiArticles, $guardianArticles, $nyTimesArticles)
    {
        $formattedArticles = [];

        // Format and add NewsAPI articles to the aggregated list
        foreach ($newsApiArticles as $article) {
            $formattedArticle = [
                'title' => $article['title'],
                'content' => $article['content'],
                'description' => $article['description'],
                'author' => $article['author'],
                'published_at' => Carbon::make($article['publishedAt'])->diffForHumans(),
                'web_url' => $article['url'] ?? null,
                'source' => 'NewsAPI',
            ];

            $formattedArticles[] = $formattedArticle;
        }

        // Format and add Guardian articles to the aggregated list
        foreach ($guardianArticles as $article) {
            $formattedArticle = [
                'title' => $article['webTitle'],
                'content' => $article['fields']['body'] ?? null,
                'author' => $article['fields']['byline'] ?? null,
                'published_at' => Carbon::make($article['webPublicationDate'])->diffForHumans(),
                'web_url' => $article['webUrl'] ?? null,
                'source' => 'The Guardian',
            ];

            $formattedArticles[] = $formattedArticle;
        }

        // Format and add New York Times articles to the aggregated list
        foreach ($nyTimesArticles as $article) {
            $formattedArticle = [
                'title' => $article['headline']['print_headline'],
                'content' => $article['lead_paragraph'],
                'author' => $article['byline']['original'],
                'published_at' => Carbon::make($article['pub_date'])->diffForHumans(),
                'web_url' => $article['web_url'],
                'source' => 'The New York Times',
            ];

            $formattedArticles[] = $formattedArticle;
        }


        $unique_identifier = base64_encode(auth()->id());

        Cache::put("$unique_identifier:articles", $formattedArticles, 3600 * 12);

        return self::paginateArticles($formattedArticles);

    }

    public static function paginateArticles($articles, $perPage = 12,  $page = 1)
    {
        $articles = collect($articles)->sortByDesc('published_at');

        $total = count($articles);
        $currentPage = (int) $page;
        $items = array_slice($articles->toArray(), ($currentPage - 1) * $perPage, $perPage);

        $paginatedArticles = new LengthAwarePaginator($items, $total, $perPage, $currentPage);

        return $paginatedArticles;
    }

}

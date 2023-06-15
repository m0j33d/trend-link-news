<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Response;
use Tests\TestCase;

class NewsArticleTest extends TestCase
{

    use RefreshDatabase;

    public $user;

    protected function setUp(): void
    {
        parent::setUp();

        // Run a specific seeder...
        $this->artisan('passport:install');
        $this->seed();

        $this->user = $this->createUser();

    }

    public function test_auth_users_only_can_access_news_endpoint()
    {
        $request1 = $this->get(route('news.fetch'));
        $request1->assertStatus(Response::HTTP_UNAUTHORIZED);

        $request2 = $this->get(route('news.fetch.cached'));
        $request2->assertStatus(Response::HTTP_UNAUTHORIZED);
    }

    public function test_get_a_user_can_fetch_news()
    {
        $request = $this->actingAs($this->user, 'api')->get(route('news.fetch'));
        $request->assertOk();

        $content = json_decode($request->getContent());
        $request->assertOk();
        $this->assertIsArray($content->data);
    }

    public function test_a_user_can_fetch_cached_news()
    {
        $request = $this->actingAs($this->user, 'api')->get(route('news.fetch'));
        $request->assertOk();

        $request2 = $this->actingAs($this->user, 'api')->get(route('news.fetch.cached'));
        $request2->assertOk();
    }
}

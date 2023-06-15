<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\Response;
use Tests\TestCase;

class UserTest extends TestCase
{
    use RefreshDatabase;

    public $user;

    protected function setUp(): void
    {
        parent::setUp();

        $this->artisan('passport:install');

        $this->seed();

        $this->user = $this->createUser();
    }

    public function test_auth_users_only_can_access_users_endpoint()
    {
        $request1 = $this->get(route('user.index'));
        $request1->assertStatus(Response::HTTP_UNAUTHORIZED);

        $request3 = $this->put(route('user.update', $this->user));
        $request3->assertStatus(Response::HTTP_UNAUTHORIZED);

        $request4 = $this->post(route('user.update.preference'));
        $request4->assertStatus(Response::HTTP_UNAUTHORIZED);

    }

    public function test_get_a_single_user_account()
    {
        $request = $this->actingAs($this->user, 'api')->get(route('user.index'));
        $request->assertOk();

        $content = json_decode($request->getContent());
        $request->assertOk();
        $this->assertSame($content->data->id, $this->user->id);
    }

    public function test_a_user_can_update_account()
    {
        $payload = [
            'name' => "Micheal Schofield",
        ];
        $request = $this->actingAs($this->user, 'api')->put(route('user.update', $this->user), $payload);
        $request->assertOk();
        $content = json_decode($request->getContent());
        $this->assertSame($content->data->name, $payload['name']);
    }

    public function test_a_user_can_update_preferences()
    {
        $payload = [
            "sources" => [
                [
                    "value"=> "newsapi",
                    "label" => "NewsAPI.org"
                ]
            ],
            "authors" => [
                [
                    "value"=> "peter",
                    "label" => "Peter"
                ]
            ],
            "categories" => [
                [
                    "value"=> "sport",
                    "label" => "Sport"
                ]
            ]
        ];

        $request = $this->actingAs($this->user, 'api')->post(route('user.update.preference'), $payload);
        $request->assertOk();
    }

}

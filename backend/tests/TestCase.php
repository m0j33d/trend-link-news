<?php

namespace Tests;

use App\Models\User;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Foundation\Testing\TestCase as BaseTestCase;

abstract class TestCase extends BaseTestCase
{
    use CreatesApplication;

    /**
     * This creates a user
     *
     * @param array|null $data
     * @return User|Authenticatable
     */
    public function createUser(array $data = null): User | Authenticatable
    {
        return User::factory()->create($data ?: ['email' => 'test@gmail.com']);
    }
}

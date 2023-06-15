<?php

namespace App\Providers;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        $this->app->bind('path.public', function () {
            return base_path() . '/api';
        });
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        // prevents lazy loading to curb N+1 queries
        Model::preventLazyLoading(!app()->isProduction());
    }
}

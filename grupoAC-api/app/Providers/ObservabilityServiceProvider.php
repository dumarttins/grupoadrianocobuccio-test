<?php

namespace App\Providers;

use Illuminate\Database\Events\QueryExecuted;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\ServiceProvider;

class ObservabilityServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        // Registrar log para queries lentas
        if (config('app.debug')) {
            DB::listen(function (QueryExecuted $query) {
                // Logar queries que levam mais de 100ms
                if ($query->time > 100) {
                    Log::channel('slow_queries')->warning('Slow query detected', [
                        'sql' => $query->sql,
                        'bindings' => $query->bindings,
                        'time' => $query->time,
                    ]);
                }
            });
        }

        // Registrar log para erros de API
        $this->app['events']->listen('Illuminate\Http\Client\Events\ResponseReceived', function ($event) {
            if ($event->response->failed()) {
                Log::channel('api')->error('API request failed', [
                    'url' => $event->request->url(),
                    'method' => $event->request->method(),
                    'status' => $event->response->status(),
                    'body' => $event->response->body(),
                ]);
            }
        });
    }
}
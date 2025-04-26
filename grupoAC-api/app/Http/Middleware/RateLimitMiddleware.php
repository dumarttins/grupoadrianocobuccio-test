<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Cache\RateLimiter;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter as FacadesRateLimiter;
use Symfony\Component\HttpFoundation\Response;

class RateLimitMiddleware
{
    /**
     * Limita requisições por IP
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  int  $maxAttempts
     * @param  int  $decayMinutes
     * @return mixed
     */
    public function handle(Request $request, Closure $next, $maxAttempts = 60, $decayMinutes = 1): Response
    {
        $key = $request->ip();

        if (FacadesRateLimiter::tooManyAttempts($key, $maxAttempts)) {
            return response()->json([
                'status' => 'error',
                'message' => 'Muitas requisições. Por favor, tente novamente em alguns minutos.',
            ], 429);
        }

        FacadesRateLimiter::hit($key, $decayMinutes * 60);

        return $next($request);
    }
}
<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    protected function boot(): void
    {
        // ... outros códigos

        // Registrar observers
        \App\Models\Transaction::observe(\App\Observers\TransactionObserver::class);
    }
}

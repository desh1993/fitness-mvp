<?php

return [
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'logout',
    ],

    'allowed_methods' => ['*'],

    // ❌ cannot use '*' when using cookies
    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:5173',
        'http://fitness-mvp.localhost',
        'http://localhost',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    // ✅ MUST be true for Sanctum SPA cookie auth
    'supports_credentials' => true,
];

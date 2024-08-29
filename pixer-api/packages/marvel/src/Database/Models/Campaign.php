<?php

namespace Marvel\Models;

use Marvel\Database\Models\Product;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Log;

class Campaign extends Model
{
    protected $fillable = [
        'user_id', 'name'
    ];

    public function products()
    {
        return $this->belongsToMany(Product::class, 'campaign_products')->withPivot('order_id', 'price', 'name');
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\Pivot;

class CampaignProduct extends Pivot
{
    protected $table = 'campaign_products';
    protected $fillable = ['campaign_id', 'product_id', 'order_id', 'name', 'price'];
}

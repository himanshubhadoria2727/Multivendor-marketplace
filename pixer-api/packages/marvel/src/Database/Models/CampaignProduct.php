<?php

namespace Marvel\Models;
use Marvel\Database\Models\Product;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CampaignProduct extends Model
{
    use HasFactory;

    protected $fillable = ['campaign_id', 'product_id', 'order_id', 'name','price'];

    public function campaign()
    {
        return $this->belongsTo(Campaign::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}

<?php

namespace Marvel\Repositories;

use Marvel\Models\Campaign;
use Marvel\Database\Models\Product;
use Illuminate\Support\Facades\Log;

class CampaignRepository
{
    public function create(array $data)
    {
        return Campaign::create($data);
    }

    public function addProducts(Campaign $campaign, array $productIds)
    {
        $products = Product::whereIn('id', $productIds)->get();
        $campaignProducts = [];
        
        foreach ($products as $product) {
            $campaignProducts[$product->id] = ['order_id' => null, 'name' => $product->name];
        }
        
        $campaign->products()->attach($campaignProducts);
        
        return $campaign->load('products');
    }

    public function getUserCampaigns($userId)
    {
        return Campaign::with('products')->where('user_id', $userId)->get();
    }
}

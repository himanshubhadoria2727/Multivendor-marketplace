<?php

namespace Marvel\Repositories;

use Marvel\Models\Campaign;
use Illuminate\Support\Facades\Log;

class CampaignRepository
{
    public function create(array $data)
    {
        Log::info("Inside Controller");
        return Campaign::create($data);
    }

    public function addProducts(Campaign $campaign, array $productIds)
    {
        $campaign->products()->attach($productIds);
        return $campaign->load('products');
    }

    public function getUserCampaigns($userId)
    {
        return Campaign::with('products')->where('user_id', $userId)->get();
    }
}

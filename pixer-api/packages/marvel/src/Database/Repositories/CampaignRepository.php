<?php

namespace Marvel\Repositories;

use Marvel\Models\Campaign;
use Marvel\Models\CampaignProduct;
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
        $campaignProducts = [];
        foreach ($productIds as $productId) {
            $campaignProducts[] = ['product_id' => $productId, 'order_id' => null, 'name' => ''];
        }
        $campaign->products()->createMany($campaignProducts);
        return $campaign->load('products');
    }

    public function getUserCampaigns($userId)
    {
        return Campaign::with('products')
                       ->where('user_id', $userId)
                       ->get()
                       ->map(function ($campaign) {
                           return [
                               'id' => $campaign->id,
                               'name' => $campaign->name,
                               'product_count' => $campaign->products->count(),
                               'order_count' => $campaign->products->whereNotNull('order_id')->count()
                           ];
                       });
    }

    public function getCampaignById($id)
    {
        return Campaign::with('products')->findOrFail($id);
    }

    public function addProductToExistingCampaign(Campaign $campaign, array $productIds)
    {
        $campaignProducts = [];
        foreach ($productIds as $productId) {
            $campaignProducts[] = ['product_id' => $productId, 'order_id' => null, 'name' => ''];
        }
        $campaign->products()->createMany($campaignProducts);
        return $campaign->load('products');
    }
    public function getAllCampaignProducts($userId)
    {
        return CampaignProduct::whereHas('campaign', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->get();
    }
    
}
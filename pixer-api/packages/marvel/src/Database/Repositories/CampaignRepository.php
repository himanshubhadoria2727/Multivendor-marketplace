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
            $product = Product::find($productId);
            if ($product) {
                $campaignProducts[] = [
                    'product_id' => $productId, 
                    'order_id' => null, 
                    'name' => $product->name,
                    'price' => $product->price
                ];
            } else {
                Log::warning('Product not found', ['product_id' => $productId]);
            }
        }
        if (!empty($campaignProducts)) {
            $campaign->products()->createMany($campaignProducts);
        }
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
            $product = Product::find($productId);
            if ($product) {
                $campaignProducts[] = [
                    'product_id' => $productId, 
                    'order_id' => null, 
                    'name' => $product->name,
                    'price'=> $product->price
                ];
            } else {
                Log::warning('Product not found', ['product_id' => $productId]);
            }
        }
        if (!empty($campaignProducts)) {
            $campaign->products()->createMany($campaignProducts);
        }
        return $campaign->load('products');
    }

    public function removeProductFromCampaign(Campaign $campaign, $productId)
    {
        $campaignProduct = $campaign->products()->where('product_id', $productId)->first();

        if ($campaignProduct) {
            $campaignProduct->delete();
        } else {
            Log::warning('Product not found in campaign', ['campaign_id' => $campaign->id, 'product_id' => $productId]);
        }

        return $campaign->load('products');
    }

    public function getAllCampaignProducts($userId)


    {
        Log::info('inside get all campaign products ');
        return CampaignProduct::whereHas('campaign', function ($query) use ($userId) {
                $query->where('user_id', $userId);
            })
            ->with('product') // Ensure products are eager loaded
            ->get();
    }
}

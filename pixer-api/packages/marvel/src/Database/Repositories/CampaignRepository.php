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
                $campaignProducts[$productId] = [
                    'order_id' => null,
                    'name' => $product->name,
                    'price' => $product->price
                ];
            } else {
                Log::warning('Product not found', ['product_id' => $productId]);
            }
        }
        if (!empty($campaignProducts)) {
            $campaign->products()->attach($campaignProducts);
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
                               'order_count' => $campaign->products->whereNotNull('pivot.order_id')->count(),
                               'created_at' => $campaign->created_at,
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
            Log::info('product: ' . $product);
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
            $campaign->products()->attach($campaignProducts);
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

    public function createOrUpdateCampaign($linkUrl, $productId, $price, $orderId, $userId)
    {
        // Extract the domain name from the link URL
        $campaignName = parse_url($linkUrl, PHP_URL_HOST);

        // Ensure the campaign name is not empty
        if (empty($campaignName)) {
            Log::warning('Invalid link URL', ['link_url' => $linkUrl]);
            return null;
        }

        // Find or create the campaign by name and user_id
        $campaign = Campaign::firstOrCreate(
            ['name' => $campaignName, 'user_id' => $userId],
            ['user_id' => $userId]
        );

        // Check if the product is already associated with the campaign
        $existingProduct = $campaign->products()->where('product_id', $productId)->first();

        if ($existingProduct) {
            // Update the order_id if the product is already in the campaign
            $existingProduct->pivot->order_id = $orderId;
            $existingProduct->pivot->save();
        } else {
            // Add the product to the campaign
            $product = Product::find($productId);
            if ($product) {
                // Create a new CampaignProduct instance
                $campaignProduct = new CampaignProduct([
                    'campaign_id' => $campaign->id,
                    'product_id' => $productId,
                    'order_id' => $orderId,
                    'name' => $product->name,
                    'price' => $price,
                ]);

                // Log details for debugging
                Log::info('CampaignProduct to be saved', [
                    'campaign_id' => $campaign->id,
                    'product_id' => $productId,
                    'order_id' => $orderId,
                    'price' => $price
                ]);

                // Associate the CampaignProduct with the Campaign and save
                $campaignProduct->save(); // This ensures campaign_id is set correctly
            } else {
                Log::warning('Product not found', ['product_id' => $productId]);
            }
        }

        return $campaign->load('products');
    }
}

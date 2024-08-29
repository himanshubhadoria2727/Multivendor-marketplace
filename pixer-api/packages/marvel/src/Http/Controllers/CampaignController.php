<?php

namespace Marvel\Http\Controllers;

use Marvel\Http\Requests\CreateCampaignRequest;
use Marvel\Http\Requests\AddProductsToCampaignRequest;
use Marvel\Repositories\CampaignRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class CampaignController extends CoreController
{
    protected $campaignRepository;

    public function __construct(CampaignRepository $campaignRepository)
    {
        Log::info('Inside CampaignController constructor');
        $this->campaignRepository = $campaignRepository;
    }

    public function store(CreateCampaignRequest $request)
    {
        Log::info('Inside store method');

        $data = $request->validated();
        $data['user_id'] = Auth::id();
        $campaign = $this->campaignRepository->create($data);

        if (isset($data['product_ids'])) {
            $this->campaignRepository->addProducts($campaign, $data['product_ids']);
        }

        return response()->json(['campaign' => $campaign], 201);
    }

    public function index(Request $request)
    {
        Log::info('Inside index method');

        $userId = Auth::id();
        $campaigns = $this->campaignRepository->getUserCampaigns($userId);

        return response()->json(['campaigns' => $campaigns], 200);
    }

    public function show($id)
    {
        Log::info('Inside show method with campaign ID: ' . $id);

        $campaign = $this->campaignRepository->getCampaignById($id);

        return response()->json(['campaign' => $campaign], 200);
    }

    public function addProducts(AddProductsToCampaignRequest $request, $id)
    {
        Log::info('Inside addProducts method with campaign ID: ' . $id);

        $campaign = $this->campaignRepository->getCampaignById($id);

        if ($campaign->user_id !== Auth::id()) {
            Log::warning('Unauthorized access attempt for campaign ID: ' . $id);
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $productIds = $request->validated()['product_ids'];
        $this->campaignRepository->addProductToExistingCampaign($campaign, $productIds);

        return response()->json(['campaign' => $campaign->load('products')], 200);
    }

    public function getCampaignProducts($id)
    {
        Log::info('Inside getCampaignProducts method with campaign ID: ' . $id);

        $campaign = $this->campaignRepository->getCampaignById($id);

        if ($campaign->user_id !== Auth::id()) {
            Log::warning('Unauthorized access attempt for campaign ID: ' . $id);
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $products = $campaign->products;

        return response()->json(['products' => $products], 200);
    }

    public function removeProduct(Request $request, $campaignId, $productId)
    {
        Log::info('Inside removeProduct method with campaign ID: ' . $campaignId . ' and product ID: ' . $productId);

        $campaign = $this->campaignRepository->getCampaignById($campaignId);

        if ($campaign->user_id !== Auth::id()) {
            Log::warning('Unauthorized access attempt for campaign ID: ' . $campaignId);
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $this->campaignRepository->removeProductFromCampaign($campaign, $productId);

        return response()->json(['message' => 'Product removed from campaign successfully'], 200);
    }

    // public function getAllCampaignProducts(Request $request)
    // {
    //     Log::info('Inside getAllCampaignProducts method');
    //
    //     $userId = Auth::id();
    //     $campaignProducts = $this->campaignRepository->getAllCampaignProducts($userId);
    //
    //     return response()->json(['campaign_products' => $campaignProducts], 200);
    // }
}

<?php

namespace Marvel\Http\Controllers;

use Marvel\Http\Requests\CreateCampaignRequest;
use Marvel\Repositories\CampaignRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;


class CampaignController extends CoreController
{
    protected $campaignRepository;

    public function __construct(CampaignRepository $campaignRepository)
    {
        $this->campaignRepository = $campaignRepository;
    }

    public function store(CreateCampaignRequest $request)
    {

        Log::info("Inside Controller");
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
        $userId = Auth::id();
        $campaigns = $this->campaignRepository->getUserCampaigns($userId);

        return response()->json(['campaigns' => $campaigns], 200);
    }
}


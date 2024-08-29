<?php

namespace Marvel\Http\Requests;
use Illuminate\Support\Facades\Log;

use Illuminate\Foundation\Http\FormRequest;

class CreateCampaignRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust authorization logic as needed
    }

    public function rules()
    {
        return [
            'name' => 'required|string|unique:campaigns,name',
            'product_ids' => 'array',
            'product_ids.*' => 'exists:products,id'
        ];
    }
}
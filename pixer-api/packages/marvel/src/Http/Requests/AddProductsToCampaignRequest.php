<?php

namespace Marvel\Http\Requests;
use Illuminate\Support\Facades\Log;

use Illuminate\Foundation\Http\FormRequest;

class AddProductsToCampaignRequest extends FormRequest
{
    public function authorize()
    {
        return true; // Adjust authorization logic as needed
    }

    public function rules()
    {
        return [
            'product_ids' => 'required|array',
            'product_ids.*' => 'exists:products,id'
        ];
    }
}
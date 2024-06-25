<?php

namespace Marvel\Http\Requests;
use Illuminate\Support\Facades\Log;

use Illuminate\Foundation\Http\FormRequest;

class CreateCampaignRequest extends FormRequest
{
    public function authorize()

    {Log::info("Inside Controller");
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'product_ids' => 'array|exists:products,id',
        ];
    }
}

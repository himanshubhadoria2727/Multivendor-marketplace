<?php

namespace Marvel\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Http\Exceptions\HttpResponseException;
use Marvel\Enums\PaymentGatewayType;

class OrderCreateRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'coupon_id'               => 'nullable|exists:Marvel\Database\Models\Coupon,id',
            'shop_id'                 => 'nullable|exists:Marvel\Database\Models\Shop,id',
            'customer_id'             => 'nullable|exists:Marvel\Database\Models\User,id',
            'language'                => ['nullable', 'string'],
            'title'                => ['nullable', 'string'],
            'ancor'                => ['nullable', 'string'],
            'postUrl'                => ['nullable', 'string'],
            'link_url'                => ['nullable', 'string'],
            'url'                => ['nullable', 'string'],
            'instructions'                => ['nullable', 'string'],
            'content'                => ['nullable', 'string'],
            'file'                     => ['nullable', 'string'],
            'selectedNiche'                     => ['nullable', 'string'],
            'selectedForm'                     => ['nullable', 'string'],
            'amount'                  => 'required|numeric',
            'price'                  => 'nullable|numeric',
            'paid_total'              => 'required|numeric',
            'total'                   => 'required|numeric',
            'delivery_time'           => 'nullable|string',
            'customer_contact'        => 'string|required',
            'customer_name'           => 'nullable|string|max: 255',
            'payment_gateway'         => ['required', Rule::in(PaymentGatewayType::getValues())],
            'products'                => 'required|array',
            'card'                    => 'array',
            'token'                   => 'nullable|string',
            'use_wallet_points'       => 'nullable|boolean',
            'shipping_address'        => 'array',
            'billing_address'         => 'array',
            'altered_payment_gateway' => 'nullable|string',
            'note'                    => 'nullable|string',
            'isFullWalletPayment'     => 'required|boolean',
        ];
    }


    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}

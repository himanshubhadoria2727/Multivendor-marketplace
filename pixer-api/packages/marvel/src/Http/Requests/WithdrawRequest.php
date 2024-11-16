<?php


namespace Marvel\Http\Requests;

use Illuminate\Validation\Rule;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Http\Exceptions\HttpResponseException;
use Marvel\Enums\WithdrawStatus;

class WithdrawRequest extends FormRequest
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
            'shop_id'     => ['required', 'exists:Marvel\Database\Models\Shop,id'],
            'amount'   => ['required', 'numeric'],
            'payment_method' => ['nullable', 'string'],
            'details' => ['nullable', 'string'],
            'note' => ['nullable', 'string'],
            'address'             => ['required', 'string', 'min:5'],
            'pincode'             => ['required', 'string', 'regex:/^[0-9]{5,6}$/'],
            'paypal_id'           => ['nullable', 'string', Rule::requiredIf($this->payment_method === 'paypal')],
            'bank_name'           => ['nullable', 'string', Rule::requiredIf($this->payment_method === 'bank')],
            'ifsc_code'           => ['nullable', 'string', Rule::requiredIf($this->payment_method === 'bank'), 'regex:/^[A-Za-z]{4}[0-9]{7}$/'],
            'account_number'      => ['nullable', 'string', Rule::requiredIf($this->payment_method === 'bank')],
            'account_holder_name' => ['nullable', 'string', Rule::requiredIf($this->payment_method === 'bank')],
            'country'             => ['nullable', 'string'],
        ];
    }

    public function failedValidation(Validator $validator)
    {
        throw new HttpResponseException(response()->json($validator->errors(), 422));
    }
}

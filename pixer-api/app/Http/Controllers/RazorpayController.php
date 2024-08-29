<?php

namespace App\Http\Controllers;
use Illuminate\Support\Facades\Log;
use Illuminate\Http\Request;
use Razorpay\Api\Api;
use App\Models\Payment;
use Exception;
use Illuminate\Support\Facades\Session;
class PaymentController extends Controller
{
    public function store(Request $request) {
        Log::info("Inside store function");
        $input = $request->all();           
        $api = new Api (env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
        $payment = $api->payment->fetch($input['razorpay_payment_id']);
        if(count($input) && !empty($input['razorpay_payment_id'])) {
            try {
                $response = $api->payment->fetch($input['razorpay_payment_id'])->capture(array('amount' => $payment['amount']));
                $payment = Payment::create([
                    'r_payment_id' => $response['id'],
                    'method' => $response['method'],
                    'currency' => $response['currency'],
                    'user_email' => $response['email'],
                    'amount' => $response['amount']/100,
                    'json_response' => json_encode((array)$response)
                ]);
            } catch(Exception $e) {
                return $e->getMessage();
                Session::put('error',$e->getMessage());
                return redirect()->back();
            }
        }
        Session::put('success',('Payment Successful'));
        return redirect()->back();
    }

    public function verifyPayment(Request $request)
    {
        $api = new Api(env('RAZORPAY_KEY_ID'), env('RAZORPAY_KEY_SECRET'));
        
        $signatureStatus = $api->utility->verifyPaymentSignature([
            'razorpay_order_id' => $request->razorpay_order_id,
            'razorpay_payment_id' => $request->razorpay_payment_id,
            'razorpay_signature' => $request->razorpay_signature
        ]);

        if ($signatureStatus) {
            // Handle post-payment success logic here
            return response()->json(['status' => 'success']);
        } else {
            return response()->json(['status' => 'failure']);
        }
    }
}

<?php

namespace Marvel\Traits;

use Exception;
use Illuminate\Http\Request;
use Marvel\Database\Models\Order;
use Marvel\Database\Models\PaymentGateway;
use Marvel\Database\Models\Settings;
use Marvel\Exceptions\MarvelException;
use Marvel\Database\Models\PaymentMethod;
use Marvel\Database\Models\PaymentIntent;
use Marvel\Enums\OrderStatus;
use Marvel\Enums\PaymentGatewayType;
use Marvel\Enums\PaymentStatus;
use Marvel\Events\PaymentMethods;
use Marvel\Facades\Payment;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Log; 

trait PaymentTrait
{
    use OrderStatusManagerWithPaymentTrait;
    /**
     * attachPaymentIntent
     *
     * @param  string $order_tracking_number
     * @return PaymentIntent
     */
    public function attachPaymentIntent($order_tracking_number)
    {
        return PaymentIntent::where(function ($query) use ($order_tracking_number) {
            $query->where('tracking_number', '=', $order_tracking_number)
                ->orWhere('order_id', '=', $order_tracking_number);
        })->first();
    }

    /**
     * processPaymentIntent
     *
     * @param  mixed  $request
     * @param  mixed  $settings
     * @return object
     * @throws Exception
     */
    public function processPaymentIntent($request, Settings $settings): object
    {            Log::info("payemt intent");

        
        try {
            $chosen_payment_gateway = '';
            $is_payment_intent_exists = false;
            // Log::info("entered try");
            $order_tracking_number = $request['tracking_number'];
            $requested_payment_gateway = $request['payment_gateway'];
            // Log::info("requested_payment_gateway");
            $order = $this->fetchOrderByTrackingNumber($order_tracking_number);
            // Log::info("fetchOrderByTrackingNumber");
            $initial_payment_gateway = $order->payment_gateway;

            if ($requested_payment_gateway !== $initial_payment_gateway) {
                // Log::info("requested payment gateway condition");

                $chosen_payment_gateway = ucfirst(strtolower($request['payment_gateway']));
            } else {
                if (isset($settings->options['paymentGateway'])) {
                    foreach ($settings->options['paymentGateway'] as $key => $available_gateway) {
                        if (strtoupper($available_gateway['name']) === $requested_payment_gateway) {
                            // Log::info("nested 1st");
                            $chosen_payment_gateway = ucfirst($available_gateway['name']);
                        }
                    }
                }
            }

            if (isset($chosen_payment_gateway) && !empty($chosen_payment_gateway)) {
                // Log::info("chosen gateway");
                $is_payment_intent_exists = $this->paymentIntentExists($order_tracking_number, $chosen_payment_gateway);
                if (!$is_payment_intent_exists) {
                    // Log::info("before save payment intent");
                    $newPaymentIntent = $this->savePaymentIntent($order, $chosen_payment_gateway, $request);
                    // Log::info("save payment intent");
                    if ($request['recall_gateway'] && isset($newPaymentIntent)) {
                        // Log::info("recall gateway");
                        $this->deleteOlderPaymentIntent($order_tracking_number, ucfirst(strtolower($order->payment_gateway)));
                        $this->updateOrderData($initial_payment_gateway, $chosen_payment_gateway, $order);
                    }
                    // Log::info("new payment intent");
                    return $newPaymentIntent;
                }
            }
            // Log::info("before return");

            return PaymentIntent::where(function ($query) use ($order_tracking_number) {
                // Log::info("inside return");
                $query->where('tracking_number', '=', $order_tracking_number)
                    ->orWhere('order_id', '=', $order_tracking_number);
            })->where('payment_gateway', '=', ucfirst($chosen_payment_gateway))->first();
        } catch (\Throwable $e) {
            Log::info( $e->getMessage());

            throw $e;
        }
    }


    /**
     * paymentIntentExists
     *
     * @param  string $order_tracking_number
     * @param  string $payment_gateway
     * @return bool
     */
    public function paymentIntentExists(string $order_tracking_number, string $payment_gateway): bool
    {
        Log::info("payment intent exists");
        return PaymentIntent::where(function ($query) use ($order_tracking_number) {
            $query->where('tracking_number', '=', $order_tracking_number)
                ->orWhere('order_id', '=', $order_tracking_number);
        })->where('payment_gateway', '=', ucfirst($payment_gateway))->exists();
    }

    /**
     * deleteOlderPaymentIntent
     *
     * @param  string $order_tracking_number
     * @param  string $payment_gateway
     * @return object
     */
    public function deleteOlderPaymentIntent(string $order_tracking_number, string $payment_gateway)
    {
        return PaymentIntent::where(function ($query) use ($order_tracking_number) {
            $query->where('tracking_number', '=', $order_tracking_number)
                ->orWhere('order_id', '=', $order_tracking_number);
        })->where('payment_gateway', '=', ucfirst($payment_gateway))->forceDelete();
    }


    /**
     * updateOrderData
     *
     * @param  string $initial_payment_gateway
     * @param  string $chosen_payment_gateway
     * @param  object $order
     * @return void
     */
    public function updateOrderData(string $initial_payment_gateway, string $chosen_payment_gateway, object $order): void
    {
        $order['altered_payment_gateway'] = $initial_payment_gateway;
        $order['payment_gateway'] = strtoupper($chosen_payment_gateway);
        $order->save();
        try {
            $children = json_decode($order->children);
        } catch (\Throwable $th) {
            $children = $order->children;
        }
        if (is_array($children) && count($children)) {
            foreach ($order->children as $child_order) {
                $child_order->payment_gateway = strtoupper($chosen_payment_gateway);
                $child_order->altered_payment_gateway = $initial_payment_gateway;
                $child_order->save();
            }
        }
    }


    /**
     * savePaymentIntent
     *
     * @param  mixed $order
     * @param  string $payment_gateway
     * @param  mixed $request
     * @return object
     */
    public function savePaymentIntent($order, $payment_gateway, $request)
    {
        // Log::info("inside save payment function");
        // Log::info("inside save payment function". $payment_gateway.$order.$request);

        
        return PaymentIntent::create([
            'order_id'            => $order->id,
            "tracking_number"     => $order->tracking_number,
            "payment_gateway"     => $payment_gateway,
            "payment_intent_info" => $this->createPaymentIntent($order, $request, $payment_gateway),
        ]);
    }


    /**
     * createPaymentIntent
     *
     * @param  mixed  $order
     * @param  mixed  $request
     * @param  string $payment_gateway
     * @return array
     * @throws Exception
     */
    public function createPaymentIntent(Order $order, Request $request, string $payment_gateway): array
    {           Log::info("inside create payment intent");
                Log::info("request inside intent".$request);
                $requestData = json_decode($request->getContent(), true);

                // Access the 'amount' field from the parsed data
                $amount = $requestData['amount'];
            
        $created_intent = [
        "amount"                => $amount,
        "order_tracking_number" => $order->tracking_number,
    ];
        try{    
            if ($request->user() !== null) {
                $created_intent["user_email"] = $order->customer->email;
                $created_intent["user_id"] = $order->customer->id; // Ensure user_id is included
            }
    
            if ($request->user() !== null && strtoupper($payment_gateway) === PaymentGatewayType::STRIPE) {
                $customer = $this->createPaymentCustomer($request);
                $created_intent["customer"] = $customer["customer_id"];
            }
            if (strtoupper($payment_gateway) === PaymentGatewayType::IYZICO) {
                $created_intent["ip"] = $request->ip();
            }

            if (strtoupper($payment_gateway) === PaymentGatewayType::RAZORPAY) {
                Log::info('inside razorpay intent');
                // For Razorpay, you typically create an order instead of a customer
                // Here, we assume that the Razorpay integration requires the order amount and details
                // $razorpayOrder = $this->createRazorpayOrder($request);
                // Log::info('razorpay order',$razorpayOrder );
                $created_intent["order_id"] = $order["order_id"];
                Log::info("order id in create intent".$order["order_id"]);
                $created_intent["order_amount"] = $request["paid_total"];
                // $created_intent["order_receipt"] = $order["order_receipt"];
                // Include any other necessary parameters for Razorpay
            }
    
            if (strtoupper($payment_gateway) === PaymentGatewayType::PAYMONGO) {
                $created_intent['selected_payment_path'] = $request['payment_sub_gateway'];
            }

    
           
        }
        catch(Exception $e){
            Log::info("vikash". $e);
        }

        return Payment::getIntent($created_intent);
    }


    /**
     * findByTrackingNumber
     *
     * @param  string $tracking_number
     * @return object
     */
    public function fetchOrderByTrackingNumber(string $tracking_number): object
    {
        try {
            return Order::where('id', "=", $tracking_number)->orWhere('tracking_number', $tracking_number)->first();
        } catch (\Exception $e) {
            throw new HttpException(404, NOT_FOUND);
        }
    }

    /**
     * saveCard
     *
     * @param  mixed $payment_method
     * @param  mixed $request
     * @return PaymentMethod
     */
    public function saveCard($payment_method, $request): PaymentMethod
    {
        // brand & network are equivalent with razorpay & stripe, "network" in marvel DB
        // type & funding are equivalent with razorpay & stripe, "type" in marvel DB

        try {
            $customers_gateway = PaymentGateway::where('user_id', '=', $request->user()->id)->where('gateway_name', '=', $request->payment_gateway)->first();

            // if first card, then set as default.
            $default = false;
            if (is_null(PaymentMethod::first())) {
                $default = true;
            } else {
                $default = $request->default_card;
            }
            /* Updating the default card to false if the payment gateway is stripe. */
            if ($default) {
                PaymentMethod::where([
                    "default_card"       => true,
                    "payment_gateway_id" =>  $customers_gateway->id,
                ])->update(['default_card' => false]);
            }

            $payment_method = PaymentMethod::create([
                'method_key'         => $payment_method->id,
                "payment_gateway_id" => $customers_gateway->id,
                "default_card"       => $default,
                "fingerprint"        => $payment_method->card->fingerprint,
                "owner_name"         => $payment_method->billing_details->name,
                "last4"              => $payment_method->card->last4,
                "expires"            => $payment_method->card->exp_month . "/" . $payment_method->card->exp_year,
                "network"            => $payment_method->card->brand,
                "type"               => $payment_method->card->funding,
                "origin"             => $payment_method->card->country,
                "verification_check" => $payment_method->card->checks->cvc_check,
            ]);

            // run a job to check and set default card
            if ($request->default_card) {
                event(new PaymentMethods($payment_method));
            }

            return $payment_method;
        } catch (\Exception $e) {
            throw new MarvelException(SOMETHING_WENT_WRONG);
        }
    }

    /**
     * createPaymentCustomer
     *
     * @param  mixed $request
     * @return object
     */
    public function createPaymentCustomer($request)
    {
        try {
            $selected_payment_gateway = strtoupper($request->payment_gateway);
            Log::info("selected_paymen". $selected_payment_gateway);
            if (!$this->customerAlreadyExists($request->user()->id, $selected_payment_gateway)) {
                Log::info("user id".$request->user()->id);
                $customer = Payment::createCustomer($request);
                if (in_array($selected_payment_gateway, PaymentGatewayType::getValues())) {
                    PaymentGateway::create([
                        'user_id'      => $request->user()->id,
                        'customer_id'  => $customer['customer_id'],
                        'gateway_name' => $selected_payment_gateway
                    ]);
                }
            } else {
                $customer = PaymentGateway::where('user_id', '=', $request->user()->id)->where('gateway_name', '=', $selected_payment_gateway)->first();
            }
            return $customer;
        } catch (Exception $e) {
            throw new HttpException(400, $e->getMessage());
        }
    }
    
 /**
     * createRazorpayOrder
     *
     * @param  mixed $request
     * @return array
     */
    public function createRazorpayOrder($request)
    {
        try {
            Log::info('inside create razorpayorder function');
    
            // Extract necessary data from the request
            $selected_payment_gateway = strtoupper($request->payment_gateway);
            $user_id = $request->user()->id;
            if (!$this->customerAlreadyExists($request->user()->id, $selected_payment_gateway)){
                Log::info("user id in create order ".$request->user()->id);
    
                $order = Payment::createOrder($request);
    
                // Ensure $order is an array and access its elements as array keys
                if (in_array($selected_payment_gateway, PaymentGatewayType::getValues())) {
                    PaymentGateway::create([
                        'user_id'  => $user_id,
                        'id'       =>$order['id'],
                        'amount'   => $order['amount'],
                        'currency' => "USD", // Assuming the currency is INR, change if needed
                        'receipt'  => $order['receipt'],
                    ]);
                }
                else {
                    $order = PaymentGateway::where('user_id', '=', $request->user()->id)->where('gateway_name', '=', $selected_payment_gateway)->first();
                }
    
                // If order creation is successful, return order details
                return [
                    'order_id'     => $order['id'],     
                    'order_amount' => $order['amount'],
                    'order_receipt'=> $order['receipt'],
                    // You can include more order details if required
                ];
            }
        } catch (Exception $e) {
            // Log any errors that occur during order creation
            Log::error('Error while creating Razorpay order: ' . $e->getMessage());
    
            // Return an error message or handle the error as needed
            return ['error' => 'Failed to create Razorpay order'];
        }
    }
    


    /**
     * customerAlreadyExists
     *
     * @param  string $user_id
     * @return boolean
     */
    public function customerAlreadyExists($user_id, $selected_payment_gateway)
    {
        try {
            $customer_exists = false;
            $customer_exists = PaymentGateway::where('user_id', '=', $user_id)->where('gateway_name', '=', $selected_payment_gateway)->exists();
            if ($customer_exists) {
                return true;
            }
            return $customer_exists;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * paymentMethodAlreadyExists
     *
     * @param  string $fingerprint
     * @return bool
     */
    public function paymentMethodAlreadyExists($fingerprint)
    {
        try {
            $payment_method_exists = false;
            $payment_method_exists = PaymentMethod::where('fingerprint', '=', $fingerprint)->exists();
            if ($payment_method_exists) {
                return true;
            }
            return $payment_method_exists;
        } catch (\Exception $e) {
            throw $e;
        }
    }

    /**
     * webhookSuccessResponse
     *
     * @param  mixed  $order
     * @param  string $order_status
     * @param  string $payment_status
     * @return void
     */
    public function webhookSuccessResponse($order, $order_status, $payment_status)
    {
        $isFinal = $this->checkOrderStatusIsFinal($order);
        if ($isFinal) return;

        $order->order_status = $order_status;
        $order->payment_status = $payment_status;
        $order->save();
        try {
            $children = json_decode($order->children);
        } catch (\Throwable $th) {
            $children = $order->children;
        }
        if (is_array($children) && count($children)) {
            foreach ($order->children as $child_order) {
                $child_order->order_status = $order_status;
                $child_order->payment_status = $payment_status;
                $child_order->save();
            }
        }
        $this->orderStatusManagementOnPayment($order, OrderStatus::PROCESSING, $payment_status);
    }
}

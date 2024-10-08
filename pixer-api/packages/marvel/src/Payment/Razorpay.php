<?php

namespace Marvel\Payments;

use Exception;
use Marvel\Database\Models\Order;
use Marvel\Database\Models\PaymentIntent;
use Marvel\Traits\PaymentTrait;
use Razorpay\Api\Api;
use Marvel\Enums\OrderStatus;
use Marvel\Enums\PaymentStatus;
use Razorpay\Api\Errors\SignatureVerificationError;
use Illuminate\Support\Str;
use Symfony\Component\HttpKernel\Exception\HttpException;
use Illuminate\Support\Facades\Log;
use Barryvdh\Debugbar\Facades\Debugbar;
use Throwable;

class Razorpay extends Base implements PaymentInterface
{
    use PaymentTrait;

    public Api $api;

    public function __construct()
    {
        parent::__construct();
        $this->api = new Api(config('shop.razorpay.key_id'), config('shop.razorpay.key_secret'));
    }

    /**
     * Create an order
     *
     * @param array $data
     * @return array
     * @throws Exception
     */
    public function createOrder(object $request): array
    {
        try {
            // Validate and extract required data from the input array
            if (!isset($request['tracking_number'], $request['amount'])) {
                throw new HttpException(400, 'Invalid input data');
            }
            Log::info("inside createOrder funtion in razorpay");
            $orderTrackingNumber = $request['tracking_number'];
            $amount = (int)round($request['amount'], 2) * 100; // Convert to the smallest currency unit
            Log::info("inside createOrder funtion in razorpay ".$amount);
            Log::info("create order tracking number".$orderTrackingNumber);
            Debugbar::addMessage('tracking number',$orderTrackingNumber);
            // Create the order in Razorpay
            $order = $this->api->order->create([
                'receipt'  => $orderTrackingNumber,
                'amount'   => $amount,
                'currency' => "INR",
            ]);

         
            // Debugbar::info("create order info",$order['amount']);
            // Debugbar::error('Error!');
            // Debugbar::warning('Watch out…');
            // Debugbar::addMessage('Another message', 'mylabel');

            Log::info("create order tracking number second".$orderTrackingNumber);

            // Return the necessary order details
            return [
                'order_id'              => $order->id,
                'receipt'               => $order->receipt,
                'currency'              => $order->currency,
                'amount'                => $order->amount,
            ];
        } catch (Exception $e) {
            // Log the error for debugging purposes
            Log::error('Error creating Razorpay order: ' . $e->getMessage());
            throw new HttpException(400, 'Something went wrong with creating the order');
        }
    }

    // The rest of your existing methods...

    /**
     * Get payment intent for payment
     *
     * @param $data
     * @return array
     * @throws Exception
     */
    public function getIntent($data): array
    {
        try {
            extract($data);
            $order = $this->api->order->create([
                'receipt'  => $order_tracking_number,
                'amount'   => (int)round($amount, 2) * 100,
                'currency' => $this->currency,
            ]);

            return [
                'payment_id'            => $order->id,
                'order_tracking_number' => $order->receipt,
                'currency'              => $order->currency,
                'amount'                => $order->amount,
                'is_redirect'           => false,
            ];
        } catch (Exception $e) {
            Log::error('Error creating Razorpay order: ' . $e->getMessage());
            throw new HttpException(400, SOMETHING_WENT_WRONG_WITH_PAYMENT);
        }
    }

    /**
     * Verify a payment
     *
     * @param $id
     * @return false|mixed
     * @throws Exception
     */
    public function verify($id): mixed
    {
        try {
            $order = $this->api->order->fetch($id);
            return isset($order->status) ? $order->status : false;
        } catch (Exception $e) {
            throw new HttpException(400, SOMETHING_WENT_WRONG_WITH_PAYMENT);
        }
    }

    /**
     * handleWebHooks
     *
     * @param  mixed  $request
     * @return void
     * @throws Throwable
     */
    public function handleWebHooks($request): void
    {
        $webhookSecret = config('shop.razorpay.webhook_secret');
        $webhookBody = @file_get_contents('php://input');
        $webhookSignature = $request->header('X-Razorpay-Signature');

        try {
            if ($webhookBody && $webhookSignature && $webhookSecret) {
                $this->api->utility->verifyWebhookSignature($webhookBody, $webhookSignature, $webhookSecret);
            } else {
                // Invalid request
                http_response_code(400);
                exit();
            }
        } catch (SignatureVerificationError $e) {
            // Invalid signature
            http_response_code(400);
            exit();
        }

        $eventStatus = (string) Str::of($request->event)->replace('payment.', '', $request->event);

        switch ($eventStatus) {
            case 'dispute.won':
            case 'dispute.created':
            case 'authorized':
                $this->updatePaymentOrderStatus($request, OrderStatus::PENDING, PaymentStatus::PROCESSING);
                break;
            case 'captured':
                $this->updatePaymentOrderStatus($request, OrderStatus::PROCESSING, PaymentStatus::SUCCESS);
                break;
            case 'failed':
                $this->updatePaymentOrderStatus($request, OrderStatus::PENDING, PaymentStatus::FAILED);
        }

        // To prevent loop for any case
        http_response_code(200);
        exit();
    }

    /**
     * Update Payment and Order Status
     *
     * @param $request
     * @param $orderStatus
     * @param $paymentStatus
     * @return void
     */
    public function updatePaymentOrderStatus($request, $orderStatus, $paymentStatus): void
    {
        $payload = $request->payload['payment']['entity'];
        $paymentIntent = PaymentIntent::whereJsonContains('payment_intent_info', ['payment_id' => $payload['order_id']])->first();
        $trackingId = $paymentIntent->tracking_number;
        $order = Order::where('tracking_number', '=', $trackingId)->first();
        $this->webhookSuccessResponse($order, $orderStatus, $paymentStatus);
    }

    /**
     * createCustomer
     *
     * @param  mixed  $request
     * @return array
     */
    public function createCustomer($request): array
    {
        return [];
    }

    /**
     * attachPaymentMethodToCustomer
     *
     * @param  string  $retrieved_payment_method
     * @param  object  $request
     * @return object
     */
    public function attachPaymentMethodToCustomer(string $retrieved_payment_method, object $request): object
    {
        return (object) [];
    }

    /**
     * detachPaymentMethodToCustomer
     *
     * @param  string  $retrieved_payment_method
     * @return object
     */
    public function detachPaymentMethodToCustomer(string $retrieved_payment_method): object
    {
        return (object) [];
    }

    public function retrievePaymentIntent($payment_intent_id): object
    {
        return (object) [];
    }

    /**
     * confirmPaymentIntent
     *
     * @param  string  $payment_intent_id
     * @param  array  $data
     * @return object
     */
    public function confirmPaymentIntent(string $payment_intent_id, array $data): object
    {
        return (object) [];
    }

    /**
     * setIntent
     *
     * @param  array  $data
     * @return array
     */
    public function setIntent(array $data): array
    {
        return [];
    }

    /**
     * retrievePaymentMethod
     *
     * @param  string  $method_key
     * @return object
     */
    public function retrievePaymentMethod(string $method_key): object
    {
        return (object) [];
    }
}

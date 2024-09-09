<?php

namespace Marvel\Traits;

use Marvel\Enums\PaymentStatus;
use Marvel\Enums\PaymentGatewayType;
use Illuminate\Support\Facades\Log;
use Marvel\Enums\OrderStatus as OrderStatusEnum;

trait OrderManagementTrait
{
    use OrderStatusManagerWithPaymentTrait;

    /**
     * changeOrderStatus
     *
     * @param  mixed $order
     * @param  mixed $status
     * @return void
     */
    public function changeOrderStatus($order, $status, $url = null)
{
    Log::info('Received URL in changeOrderStatus', ['url' => $url]);
    $prev_order_status = $order->order_status;
    $order->order_status = $status;
    $new_order_status = $order->order_status;   

    // If URL is provided, store it in the order
    if ($url) {
        $order->url = $url;
    }

    if ($prev_order_status !== $new_order_status) {
        $payment_gateway_type = isset($order->payment_gateway) ? $order->payment_gateway : PaymentGatewayType::CASH_ON_DELIVERY;
        $usedPaymentGateway = !in_array($payment_gateway_type, [PaymentGatewayType::CASH, PaymentGatewayType::CASH_ON_DELIVERY]);
        $isPaymentSuccess = $order->payment_status === PaymentStatus::SUCCESS;

        // Log the status change and payment gateway information
        Log::info('Changing order status', [
            'order_id' => $order->id,
            'previous_status' => $prev_order_status,
            'new_status' => $new_order_status,
            'payment_gateway_type' => $payment_gateway_type,
            'is_payment_success' => $isPaymentSuccess,
            'url' => $order->url, // Log the URL if provided
        ]);

        if ($usedPaymentGateway) {
            if ($isPaymentSuccess) {
                $this->manageVendorBalance($order, $new_order_status, $prev_order_status);
                $this->orderStatusManagementOnPayment($order, $new_order_status, '');
            } else {
                $this->orderStatusManagementOnPayment($order, $new_order_status, $order->payment_status);
            }
        } else {
            $this->manageVendorBalance($order, $new_order_status, $prev_order_status);
            $this->orderStatusManagementOnCOD($order, $prev_order_status, $new_order_status);
        }
    }
    
    $order->save();

    // Log the save action
    Log::info('Order status updated and saved', [
        'order_id' => $order->id,
        'status' => $order->order_status,
        'url' => $order->url, // Log the URL if provided
    ]);

    // Handle child orders, etc.
    try {
        $children = json_decode($order->children);
    } catch (\Throwable $th) {
        Log::error('Failed to decode order children', [
            'order_id' => $order->id,
            'error' => $th->getMessage(),
            'children_data' => $order->children
        ]);
        $children = $order->children;
    }

    if (is_array($children) && count($children) && $order->order_status === OrderStatusEnum::CANCELLED) {
        foreach ($order->children as $child_order) {
            $child_order->order_status = $status;
            $child_order->save();
            
            // Log each child's status update
            Log::info('Updated child order status', [
                'child_order_id' => $child_order->id,
                'status' => $status
            ]);
        }
    }

    return $order;
}

}

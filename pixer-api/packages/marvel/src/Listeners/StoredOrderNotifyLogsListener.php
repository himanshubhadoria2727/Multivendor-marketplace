<?php

namespace Marvel\Listeners;

use App\Events\ReviewCreated;
use App\Notifications\NewReviewCreated;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;
use Marvel\Database\Models\NotifyLogs;
use Marvel\Database\Models\Order;
use Marvel\Database\Models\Shop;
use Marvel\Enums\EventType;
use Marvel\Events\OrderCreated;
use Illuminate\Support\Facades\Cache;
use Marvel\Database\Models\User;
use Marvel\Enums\Permission;
use Marvel\Traits\UsersTrait;
use Illuminate\Support\Facades\Log;

class StoredOrderNotifyLogsListener implements ShouldQueue
{
    use UsersTrait;

    /**
     * Handle the event.
     *
     * @param  OrderCreated  $event
     * @return void
     */
    public function handle(OrderCreated $event)
    {
        Log::info('Handling OrderCreated event in StoredOrderNotifyLogsListener', [
            'event' => get_class($event),
            'order_id' => $event->order->id,
            'user_id' => $event->user ? $event->user->id : null,
        ]);

        // save notification for admin
        $admins = $this->getAdminUsers();
        if (isset($admins)) {
            foreach ($admins as $key => $admin) {
                NotifyLogs::create([
                    'receiver' => $admin->id,
                    'sender' => isset($event->user) ? $event->order->customer_id : null,
                    'notify_type' => 'order',
                    'notify_receiver_type' => 'admin',
                    'is_read' => false,
                    'notify_text' => 'One new order created. Order ID : ' . $event->order->tracking_number,
                    'notify_tracker' => $event->order->id
                ]);
                Log::info('Notification log created for admin', [
                    'admin_id' => $admin->id,
                    'order_id' => $event->order->id,
                ]);
            }
        }

        // save notification for vendor
        $child_order = Order::where('tracking_number', '=', $event->order->tracking_number)->with('children')->firstOrFail();
        foreach ($child_order->children as $key => $single_order) {
            $vendor_shop = Shop::findOrFail($single_order->shop_id);
            $selectedForm = $single_order->products[0]->pivot->selectedForm;

            // Check the value of selectedForm and modify it accordingly
            if ($selectedForm === 'guest_post') {
                $selectedForm = 'GuestPost';
            } elseif ($selectedForm === 'linkInsertion') {
                $selectedForm = 'LinkInsertion';
            }

            NotifyLogs::create([
                'receiver' => $vendor_shop->owner_id,
                'sender' => isset($event->user) ? $single_order->customer_id : null,
                'notify_type' => 'order',
                'notify_receiver_type' => 'vendor',
                'is_read' => false,
                'notify_text' => 'One new order created. Order ID : ' . $single_order->tracking_number,
                'notify_tracker' => $single_order->id . '' . $selectedForm
            ]);
            Log::info('Notification log created for vendor', [
                'vendor_id' => $vendor_shop->owner_id,
                'order_id' => $single_order->id,
            ]); 
        }
    }
}
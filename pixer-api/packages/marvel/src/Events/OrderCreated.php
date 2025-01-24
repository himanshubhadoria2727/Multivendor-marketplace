<?php

namespace Marvel\Events;

use Illuminate\Contracts\Queue\ShouldQueue;
use Marvel\Database\Models\Order;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log; // Add Log facade
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Marvel\Database\Models\NotifyLogs;
use Marvel\Database\Models\Settings;
use Marvel\Database\Models\Shop;
use Marvel\Database\Models\StoreNotice;
use Marvel\Database\Models\User;
use Marvel\Exceptions\MarvelException;
use Marvel\Enums\Permission;
use Marvel\Traits\UsersTrait;

class OrderCreated implements ShouldQueue, ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels, UsersTrait;

    public Order $order;
    public array $invoiceData;
    public $user;

    public function __construct(Order $order, array $invoiceData, ?User $user)
    {
        $this->order = $order;
        $this->invoiceData = $invoiceData;
        $this->user = $user;

        // Log constructor data
        Log::info('OrderCreated Event Initialized', [
            'order_id' => $order->id,
            'user_id' => $user?->id,
            'invoice_data' => $invoiceData,
        ]);
    }

    public function broadcastOn(): array
    {
        $event_channels = $shop_ids = $vendor_ids = [];

        Log::info('Generating broadcast channels for OrderCreated', [
            'order_id' => $this->order->id,
        ]);

        $admins = $this->getAdminUsers();
        if (isset($admins)) {
            foreach ($admins as $key => $user) {
                $channel_name = new PrivateChannel('order.created.' . $user->id);
                array_push($event_channels, $channel_name);
                Log::info('Admin notified', ['admin_id' => $user->id]);
            }
        }

        if (isset($this->order->products)) {
            foreach ($this->order->products as $key => $product) {
                if (!in_array($product->shop_id, $shop_ids)) {
                    $vendor_shop = Shop::findOrFail($product->shop_id);
                    if (!in_array($vendor_shop->owner_id, $vendor_ids)) {
                        array_push($vendor_ids, $vendor_shop->owner_id);
                    }
                    array_push($shop_ids, $product->shop_id);
                }
            }
        }

        if (isset($vendor_ids)) {
            foreach ($vendor_ids as $key => $vendor_id) {
                $channel_name = new PrivateChannel('order.created.' . $vendor_id);
                array_push($event_channels, $channel_name);
                Log::info('Vendor notified', ['vendor_id' => $vendor_id]);
            }
        }

        return $event_channels;
    }

    public function broadcastWith(): array
    {
        Log::info('Broadcasting with data', [
            'message' => 'One new order created.',
        ]);

        return [
            'message' => 'One new order created.',
        ];
    }

    public function broadcastAs(): string
    {
        return 'order.create.event';
    }

    public function broadcastWhen(): bool
    {
        try {
            $settings = Settings::first();
            $enableBroadCast = false;

            if (config('shop.pusher.enabled') === null) {
                Log::warning('Pusher configuration is not enabled');
                return false;
            }

            if (isset($settings->options['pushNotification']['all']['order'])) {
                if ($settings->options['pushNotification']['all']['order'] == true) {
                    $enableBroadCast = true;
                }
            }

            Log::info('Broadcast enabled status', ['status' => $enableBroadCast]);

            return $enableBroadCast;
        } catch (MarvelException $th) {
            Log::error('Error in broadcasting', [
                'exception' => $th->getMessage(),
            ]);

            throw new MarvelException(SOMETHING_WENT_WRONG, $th->getMessage());
        }
    }
}

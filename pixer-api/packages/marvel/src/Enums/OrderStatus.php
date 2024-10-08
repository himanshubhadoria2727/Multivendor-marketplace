<?php


namespace Marvel\Enums;

use BenSampo\Enum\Enum;

/**
 * Class RoleType
 * @package App\Enums
 */
final class OrderStatus extends Enum
{
    public const PENDING              = 'order-pending';
    public const WAITING              = 'order-waiting-approval';
    public const REJECTED             = 'order-rejected';         // Added
    public const SUBMITTED            = 'order-submitted';        // Added
    public const IMPROVEMENT          = 'order-improvement';  
    public const PROCESSING           = 'order-processing';
    public const COMPLETED            = 'order-completed';
    public const ACCEPTED            = 'order-accepted';
    public const CANCELLED            = 'order-cancelled';
    public const REFUNDED             = 'order-refunded';
    public const FAILED               = 'order-failed';
    public const AT_LOCAL_FACILITY    = 'order-at-local-facility';
    public const OUT_FOR_DELIVERY     = 'order-out-for-delivery';
    public const DEFAULT_ORDER_STATUS = 'order-pending';
}
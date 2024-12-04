<?php

namespace Marvel\Http\Resources;

use Illuminate\Http\Request;

class ProductResource extends Resource
{
    /**
     * Transform the resource into an array.
     *
     * @param  Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id'                   => $this->id,
            'name'                 => $this->name,
            'slug'                 => $this->slug,
            'type'                 => getResourceData($this->type, ['settings']), // if you need extra data then pass key in array by second parameter
            'language'             => $this->language,
            'translated_languages' => $this->translated_languages,
            'product_type'         => $this->product_type,
            'shop'                 => getResourceData($this->shop, []), // if you need extra data then pass key in array by second parameter
            'sale_price'           => $this->sale_price,
            'max_price'            => $this->max_price,
            'min_price'            => $this->min_price,
            'image'                => $this->image,
            'status'               => $this->status,
            'price'                => $this->price,
            'quantity'             => $this->quantity,
            'domain_name'          => $this->domain_name,
            'domain_authority'          => $this->domain_authority,
            'domain_rating'          => $this->domain_rating,
            'organic_traffic'          => $this->organic_traffic,
            'spam_score'          => $this->spam_score,
            'is_niche'          => $this->is_niche,
            'isLinkInsertion'          => $this->isLinkInsertion,
            'is_gamble'          => $this->is_gamble,
            'is_cbd'          => $this->is_cbd,
            'is_crypto'          => $this->is_crypto,
            'is_rehab'          => $this->is_rehab,
            'is_betting'          => $this->is_betting,
            'is_vaping'          => $this->is_vaping,
            'link_type'          => $this->link_type,
            'languages'          => $this->languages,
            'countries'          => $this->countries,
            'niche_price'          => $this->niche_price,
            'link_insertion_price'          => $this->link_insertion_price,
            'link_validity'           => $this->link_validity,
            'link_counts'             => $this->link_counts,
            'word_count'              => $this->word_count,
            'tat'                     => $this->tat,
            'sponsored_marked'        => $this->sponsored_marked,
            'other_guidelines'        => $this->other_guidelines,
            'sku'                  => $this->sku,
            'sold_quantity'        => $this->sold_quantity,
            'in_flash_sale'        => $this->in_flash_sale,
            'total_downloads'      => $this->total_downloads,
            'created_at'      => $this->created_at
        ];
    }
}

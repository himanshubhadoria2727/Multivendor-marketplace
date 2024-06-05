export function generateCartItem(item: any) {
  return {
    id: item?.id,
    name: item.name,
    slug: item.slug,
    unit: item.unit,
    image: item.image?.thumbnail,
    stock: item.quantity,
    selectedForm: item.formData.selectedForm,
    selectedNiche:item.formData.selectedNiche,
    price: Number(item.sale_price ? item.sale_price : item.formData.totalPrice),
    shop: {
      slug: item.shop?.slug,
      name: item.shop?.name,
    },
    language: item.language,
  };
}

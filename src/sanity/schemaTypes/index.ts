import { type SchemaTypeDefinition } from 'sanity'
import { productCodes } from './schemas/product-codes'
import { promotionCampaign } from './schemas/promotion-campaign'
import { productCategory } from './schemas/product-category'
import { product } from './schemas/product'
import { order, orderItem, shippingAddress } from './schemas/order'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    productCodes,
    promotionCampaign,

    shippingAddress,
    orderItem,
    order,

    productCategory,
    product
  ],
}

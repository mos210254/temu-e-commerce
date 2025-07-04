import { defineField, defineType } from "sanity";

export const productCodes = defineType({
    name: "productCodes",
    title: "Product Codes",
    type: "document",
    fields: [
        defineField({
            name: "code",
            title: "Code",
            type: "string",
        }),
        defineField({
            name: "discount",
            title: "Discount Percentage (%)",
            type: "number",
        }),
        defineField({
            name: "expirationDate",
            title: "Expiration Date",
            type: "date",
        }),
    ],
});

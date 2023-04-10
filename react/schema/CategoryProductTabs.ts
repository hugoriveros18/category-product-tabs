const CategoryProductTabsSchema = {
  title: "Category Product Tabs",
  description: "Configuracion de tabs de categorias",
  type: "object",
  properties: {
    categorias: {
      title: "Lista Categorias",
      type: "array",
      items: {
        properties: {
          __editorItemTitle: {
            title: "Nombre Categoria",
            type: "string",
          },
          categoriaId: {
            title: "Category ID",
            description: 'For subcategories, use "/" (e.g.: 1/2/3)',
            type: "string"
          },
          coleccionId: {
            title: "Collection",
            type: "string"
          },
          linkRedireccionBoton: {
            title: "Url de Redirección",
            type: "string",
            default: '#'
          },
          ordenProductos: {
            title: "List Order",
            type: "string",
            enum: [
              "Relevance",
              "Sales",
              "Price, descending",
              "Price, ascending",
              "Name, descending",
              "Name, ascending",
              "Release date",
              "Discount",
            ],
            default: 'Relevance'
          },
          maximoItems: {
            title: "Max Items",
            type: "number",
            default: 10
          },
          esconderItemsNoDisponibles: {
            title: "Hide unavailable items",
            type: "boolean",
            default: false
          },
          filtroSku: {
            title: "SKU Filter",
            type: "string",
            enum: [
              "All available",
              "First available"
            ],
            default: 'All available'
          },
          cuotasMostradas: {
            title: "Displayed installments",
            type: "string",
            enum: [
              "Maximum without interest",
              "Maximum"
            ],
            default: 'Maximum without interest'
          }
        }
      }
    },
  }
}

export default CategoryProductTabsSchema;

import React, { useState, useEffect, useMemo } from 'react';
import { useCssHandles } from 'vtex.css-handles';
import { useDevice } from 'vtex.device-detector';
import CategoryProductTabsSchema from '../../schema/CategoryProductTabs';
import './styles.css';

type OrdenProductos = 'Relevance' | 'Sales' | 'Price, descending' | 'Price, ascending' | 'Name, descending' | 'Name, ascending' | 'Release date' | 'Discount';
type FiltroSku = 'All available' | 'First available';
type CuotasMostradas = 'Maximum without interest' | 'Maximum'
type Categoria = {
  __editorItemTitle: string
  categoriaId: string
  coleccionId: string
  linkRedireccionBoton: string
  ordenProductos: OrdenProductos
  maximoItems: number
  esconderItemsNoDisponibles: boolean
  filtroSku: FiltroSku
  cuotasMostradas: CuotasMostradas
}
type CategoryProductTabsProps = {
  ProductListContext: any
  categorias: Categoria[]
}
type TabsLayoutProps = {
  categorias: Categoria[]
  categoriaActiva: Categoria | null
  setCategoriaActiva: React.Dispatch<React.SetStateAction<Categoria | null>>
}

const ordenProductos = {
  'Relevance': '',
  'Sales': 'OrderByTopSaleDESC',
  'Price, descending': 'OrderByPriceDESC',
  'Price, ascending': 'OrderByPriceASC',
  'Name, descending': 'OrderByNameDESC',
  'Name, ascending': 'OrderByNameASC',
  'Release date': 'OrderByReleaseDateDESC',
  'Discount': 'OrderByBestDiscountDESC'
}
const filtroSku = {
  'All available': 'ALL_AVAILABLE',
  'First available': 'FIRST_AVAILABLE'
}
const cuotasMostradas = {
  'Maximum without interest': 'MAX_WITHOUT_INTEREST',
  'Maximum': 'MAX_WITH_INTEREST'
}

const CSS_HANDLES = [
  'categorias__general-container',
  'categorias__botones-container',
  'boton-categoria__box',
  'boton-categoria__box-text',
  'boton-categoria__box--active',
  'categorias__productos-container',
  'categorias__productos-container--internal',
  'productos__slider-container',
  'productos__slider-container--child',
  'productos__ver-todo',
  'mobile__tabs-container',
  'mobile__tabs-title',
  'mobile__tabs-list',
  'mobile__tabs-list--active',
  'mobile__tabs-list--active-text',
  'mobile__tabs-list--active-icon',
  'mobile__tabs-list--inactive',
  'mobile__tabs-list--dropdown',
]

export default function CategoryProductTabs({ProductListContext,categorias}:CategoryProductTabsProps) {

  //CSS HANDLES
  const handles = useCssHandles(CSS_HANDLES);

  //STATES
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria | null>(null);

  //EFFECTS
  useEffect(() => {
    setCategoriaActiva(categorias[0]);
  },[])


  //JSX
  return(
    <div className={`${handles['categorias__general-container']}`}>

      {/* COLUMNA BOTONES */}
      <TabsLayout
        categorias={categorias}
        categoriaActiva={categoriaActiva}
        setCategoriaActiva={setCategoriaActiva}
      />

      {/* COLUMNA PRODUCTOS */}
      <div className={`${handles['categorias__productos-container']}`}>
        <div
          className={`${handles['categorias__productos-container--internal']}`}
        >
          {
            categoriaActiva &&
            <div
              className={`${handles['productos__slider-container']}`}
            >
              <div className={`${handles['productos__slider-container--child']}`}>
                {
                  categoriaActiva &&
                  <ProductListContext
                    category={categoriaActiva.categoriaId}
                    collection={categoriaActiva.coleccionId}
                    orderBy={ordenProductos[categoriaActiva.ordenProductos]}
                    hideUnavailableItems={categoriaActiva.esconderItemsNoDisponibles}
                    maxItems={categoriaActiva.maximoItems}
                    skusFilter={filtroSku[categoriaActiva.filtroSku]}
                    installmentCriteria={cuotasMostradas[categoriaActiva.cuotasMostradas]}
                  />
                }
              </div>
              <div className={`${handles['productos__ver-todo']}`}>
                <a href={categoriaActiva.linkRedireccionBoton}>
                  VER TODO
                </a>
              </div>
            </div>
          }
        </div>
      </div>

    </div>
  )
}

CategoryProductTabs.schema = CategoryProductTabsSchema;

function TabsLayout({
  categorias,
  categoriaActiva,
  setCategoriaActiva
}:TabsLayoutProps) {

  //CSS HANDLES
  const handles = useCssHandles(CSS_HANDLES);

  //DEVICE DETECTOR
  const { device } = useDevice();

  //STATES
  const [isListOpen, setIsListOpen] = useState<boolean>(false);

  //DROPDOWN LIST
  const dropdownList = useMemo(() => {
    return categorias.filter(ctg => ctg !== categoriaActiva);
  },[categoriaActiva])

  //METHODS
  const handleTabChange = (categoria:Categoria) => {
    setIsListOpen(false)
    setCategoriaActiva(categoria)
  }

  //JSX
  if(device === "phone") {
    return (
      <div className={`${handles['mobile__tabs-container']}`}>
        <p className={`${handles['mobile__tabs-title']}`}>
          Colecciones:
        </p>
        <ul className={`${handles['mobile__tabs-list']}`}>
          <li
            className={`${handles['mobile__tabs-list--active']}`}
            onClick={() => setIsListOpen(!isListOpen)}
          >
            <p className={`${handles['mobile__tabs-list--active-text']}`}>{categoriaActiva?.__editorItemTitle}</p>
            <img
              alt='arrow'
              src='https://panamericana.vteximg.com.br/arquivos/down-arrow-category-tabs.svg'
              className={`${handles['mobile__tabs-list--active-icon']}`}
              style={{
                transform: isListOpen ? 'rotate(180deg)' : 'rotate(0deg)'
              }}
            />
          </li>
          <div
            className={`${handles['mobile__tabs-list--dropdown']}`}
            style={{
              maxHeight: isListOpen ? '1000px' : '0px'
            }}
          >
            {
              dropdownList.map((categoria, index) => {
                return (
                  <li
                    key={index}
                    onClick={() => handleTabChange(categoria)}
                    className={`${handles['mobile__tabs-list--inactive']}`}
                  >
                    {categoria.__editorItemTitle}
                  </li>
                )
              })
            }
          </div>
        </ul>
      </div>
    )
  }

  return (
    <ul className={`${handles['categorias__botones-container']}`}>
      {
        categorias.map((categoria) => {
          return(
            <li
              key={categoria.__editorItemTitle}
              className={`${handles['boton-categoria__box']} ${categoriaActiva?.__editorItemTitle === categoria.__editorItemTitle && handles['boton-categoria__box--active']}`}
              onClick={() => setCategoriaActiva(categoria)}
            >
              <p className={`${handles['boton-categoria__box-text']}`}>{categoria.__editorItemTitle}</p>
            </li>
          )
        })
      }
    </ul>
  )
}

import React, { useState, useEffect, cloneElement } from 'react';
import { useCssHandles } from 'vtex.css-handles';
import './styles.css';
import CategoryProductTabsSchema from '../../schema/CategoryProductTabs';

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
  children: any
  categorias: Categoria[]
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
  'boton-categoria__box--active',
  'categorias__productos-container',
  'categorias__productos-container--internal',
  'productos__slider-container',
  'productos__slider-container--child',
  'productos__ver-todo'
]

const CategoryProductTabs = ({categorias, children}:CategoryProductTabsProps) => {

  //CSS HANDLES
  const handles = useCssHandles(CSS_HANDLES);

  //STATES
  const [categoriaActiva, setCategoriaActiva] = useState<Categoria | null>(null);
  const [cloneChild, setCloneChild] = useState<any>(null);

  //EFFECTS
  useEffect(() => {
    setCategoriaActiva(categorias[0]);
  },[])

  useEffect(() => {
    if(categoriaActiva) {
      const newChild = cloneElement(children[0], {
        category: categoriaActiva.categoriaId,
        collection: categoriaActiva.coleccionId,
        orderBy: ordenProductos[categoriaActiva.ordenProductos],
        hideUnavailableItems: categoriaActiva.esconderItemsNoDisponibles,
        maxItems: categoriaActiva.maximoItems,
        skusFilter: filtroSku[categoriaActiva.filtroSku],
        installmentCriteria: cuotasMostradas[categoriaActiva.cuotasMostradas]
      })
      setCloneChild(newChild);
    }
  },[categoriaActiva])

  //JSX
  return(
    <div className={`${handles['categorias__general-container']}`}>

      {/* COLUMNA BOTONES */}
      <ul className={`${handles['categorias__botones-container']}`}>
        {
          categorias.map((categoria) => {
            return(
              <li
                key={categoria.__editorItemTitle}
                className={`${handles['boton-categoria__box']} ${categoriaActiva?.__editorItemTitle === categoria.__editorItemTitle && handles['boton-categoria__box--active']}`}
                onClick={() => setCategoriaActiva(categoria)}
              >
                <p>{categoria.__editorItemTitle}</p>
              </li>
            )
          })
        }
      </ul>

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
                {cloneChild}
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

export default CategoryProductTabs;

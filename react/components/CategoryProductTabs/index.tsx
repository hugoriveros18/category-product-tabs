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
  'productos__ver-todo'
]

const CategoryProductTabs = ({categorias, children}:CategoryProductTabsProps) => {

  //CSS HANDLES
  const handles = useCssHandles(CSS_HANDLES);

  //STATES
  const [categoriaActiva, setCategoriaActiva] = useState<string>('');

  //EFFECTS
  useEffect(() => {
    setCategoriaActiva('-0%');
  },[])

  //JSX
  return(
    <div className={`${handles['categorias__general-container']}`}>

      {/* COLUMNA BOTONES */}
      <ul className={`${handles['categorias__botones-container']}`}>
        {
          categorias.map((categoria, index) => {
            return(
              <li
                key={categoria.__editorItemTitle}
                className={`${handles['boton-categoria__box']} ${categoriaActiva === `-${index*100}%` && handles['boton-categoria__box--active']}`}
                onClick={() => setCategoriaActiva(`-${index*100}%`)}
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
          style={{transform: `translate(${categoriaActiva},0)`}}
        >
          {
            categorias.map((categoria, index) => {
              return(
                <div
                  key={categoria.__editorItemTitle}
                  className={`${handles['productos__slider-container']}`}
                  style={categoriaActiva === `-${index*100}%` ? {opacity: 1, transition: 'all 1s'} : {opacity: 0, transition: 'all 0.5ms'}}
                >
                  <div>
                    {
                      cloneElement(children[0], {
                        category: categoria.categoriaId,
                        collection: categoria.coleccionId,
                        orderBy: ordenProductos[categoria.ordenProductos],
                        hideUnavailableItems: categoria.esconderItemsNoDisponibles,
                        maxItems: categoria.maximoItems,
                        skusFilter: filtroSku[categoria.filtroSku],
                        installmentCriteria: cuotasMostradas[categoria.cuotasMostradas]
                      })
                    }
                  </div>
                  <div className={`${handles['productos__ver-todo']}`}>
                    <a href={categoria.linkRedireccionBoton}>
                      VER TODO
                    </a>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>

    </div>
  )
}

CategoryProductTabs.schema = CategoryProductTabsSchema;

export default CategoryProductTabs;

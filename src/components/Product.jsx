import { useEffect, useState } from 'react';
import './Products.css';

const Products = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const [sortType, setSortType] = useState('titulo');
  const [sortDirection, setSortDirection] = useState('asc');
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);

  async function fetchData() {
    try {
      const response = await fetch('https://fakestoreapi.com/products');
      const result = await response.json();
      setAllProducts(result);
      setProducts(result);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;

  const sortedProducts = products.sort((a, b) => {
    const sortMultiplier = sortDirection === 'asc' ? 1 : -1;
    if (sortType === 'titulo') {
      return sortMultiplier * a.title.localeCompare(b.title);
    }
    if (sortType === 'categoria') {
      return sortMultiplier * a.category.localeCompare(b.category);
    }
    if (sortType === 'precio') {
      return sortMultiplier * (a.price - b.price);
    }
  });

  const currentProducts = sortedProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  function paginate(pageNumber) {
    setCurrentPage(pageNumber);
  }

  function handleSort(type, direction = 'asc') {
    setSortType(type);
    setSortDirection(direction);
  }

  function getSortIcon(columnType) {
    if (sortType === columnType) {
      return sortDirection === 'asc' ? '▲' : '▼';
    }
    return null;
  }

  return (
    <div>
      <h1>Product Catalog</h1>
      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('titulo', sortType !== 'titulo' || sortDirection === 'desc' ? 'asc' : 'desc')} className={sortType === 'titulo' ? 'active' : ''}>Title {getSortIcon('titulo')}</th>
            <th onClick={() => handleSort('categoria', sortType !== 'categoria' || sortDirection === 'desc' ? 'asc' : 'desc')} className={sortType === 'categoria' ? 'active' : ''}>Category {getSortIcon('categoria')}</th>
            <th onClick={() => handleSort('precio', sortType !== 'precio' || sortDirection === 'desc' ? 'asc' : 'desc')} className={sortType === 'precio' ? 'active' : ''}>Price {getSortIcon('precio')}</th>
          </tr>
        </thead>
        <tbody>
          {currentProducts.map((product, index) => {
            return (
              <tr key={index}>
                <td className='title'>{product.title}</td>
                <td className='category'>{product.category}</td>
                <td className='price'>{product.price}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="pagination">
        {Array.from({ length: Math.ceil(allProducts.length / productsPerPage) }, (v, i) => i + 1).map((pageNumber) => {
          return (
            <button key={pageNumber} onClick={() => paginate(pageNumber)}>
              {pageNumber}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default Products;

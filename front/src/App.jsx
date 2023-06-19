import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [productos, setProductos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [precio, setPrecio] = useState('');

  useEffect(() => {
    obtenerProductos();
  }, []);

  const obtenerProductos = () => {
    fetch('http://localhost:3000/productos')
      .then(response => response.json())
      .then(data => setProductos(data))
      .catch(error => console.error(error));
  };

  const agregarProducto = () => {
    const nuevoProducto = {
      nombre: nombre,
      precio: parseFloat(precio)
    };

    fetch('http://localhost:3000/productos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoProducto)
    })
      .then(response => response.json())
      .then(data => {
        console.log(data);
        obtenerProductos(); 
        setNombre('');
        setPrecio('');
      })
      .catch(error => console.error(error));
  };


  return (
    <>
      <div>
      <h1>Lista de Productos</h1>
      <ul>
        {productos.map((product) => (
          <li key={product.id}>
            {product.nombre} - ${product.precio}
          </li>
        ))}
      </ul>

      <h2>Agregar Producto</h2>
      <input type="text" placeholder="Nombre" value={nombre} onChange={e => setNombre(e.target.value)} />
      <input type="number" placeholder="Precio" value={precio} onChange={e => setPrecio(e.target.value)} />
      <button onClick={agregarProducto}>Agregar</button>

      </div>
    </>
  )
}

export default App

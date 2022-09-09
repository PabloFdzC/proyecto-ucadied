import { Route, Routes, BrowserRouter } from 'react-router-dom';

import IniciarSesionForm from './Usuario/IniciarSesionForm';
import Navegacion from './Utilidades/Navegacion';
import JuntaDirectiva from './Organizacion/JuntaDirectiva';
import Afiliados from './Usuario/Afiliados';
import Asociaciones from './Organizacion/Asociaciones';
import CrearAdministrador from './Administrador/CrearAdministrador'


function App() {
  return (
    <div>
      <BrowserRouter>
        <Navegacion />
        <Routes>
          <Route path="/" element={<div>HOLA</div>} />
          <Route path="/iniciarSesion" element={<IniciarSesionForm />} />
          <Route path="/presidencia/juntaDirectiva" element={<JuntaDirectiva />} />

          <Route path="/presidencia/afiliados" element={<Afiliados />} />
          <Route path="/presidencia/asociaciones" element={<Asociaciones />} />
          <Route path="/administrador" element={<CrearAdministrador />} />
        </ Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

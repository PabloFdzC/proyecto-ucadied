import { Route, Routes, BrowserRouter } from 'react-router-dom';

import IniciarSesionForm from './Usuario/IniciarSesionForm.js';
import Navegacion from './Utilidades/Navegacion.js';
import MiembroJuntaDirectivaForm from './Organizacion/MiembroJuntaDirectivaForm.js';
import Afiliados from './Usuario/Afiliados.js';
import Asociaciones from './Organizacion/Asociaciones.js';
import CrearAdministrador from './Administrador/CrearAdministrador.js'


function App() {
  return (
    <div>
      <BrowserRouter>
        <Navegacion />
        <Routes>
          <Route path="/" element={<div>HOLA</div>} />
          <Route path="/iniciarSesion" element={<IniciarSesionForm />} />
          <Route path="/presidencia/juntaDirectiva" element={<MiembroJuntaDirectivaForm />} />

          <Route path="/presidencia/afiliados" element={<Afiliados />} />
          <Route path="/presidencia/asociaciones" element={<Asociaciones />} />
          <Route path="/administrador" element={<CrearAdministrador />} />
        </ Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

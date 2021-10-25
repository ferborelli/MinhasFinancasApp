import React from 'react'


import 'bootswatch/dist/flatly/bootstrap.css'
import '../custon.css'
import 'toastr/build/toastr.css'

import Navbar from '../components/navebar'
import Rotas from './rotas'
import ProvedorAutenticacao from './provedorAutenticacao'

import 'toastr/build/toastr.min.js' 

import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';

import { Button } from 'primereact/button';

class  App extends React.Component {
   render(){

    return (
     <ProvedorAutenticacao>
         <Navbar />
         <div className="container">
            <Rotas />
         </div>
     </ProvedorAutenticacao>
    )
   }
}

export default App;

import React from 'react'
import Card from '../components/card'
import FormGroup from '../components/form-group'

import UsuarioService from '../app/service/usuarioService'
import { mensagemErro } from '../components/toastr'
import { AuthContext } from '../main/provedorAutenticacao'
import { withRouter } from 'react-router-dom'

class Login extends React.Component{

    state = {
        email: '',
        senha: ''
    }
 
    constructor() {
        super();
        this.service = new UsuarioService();
    }

      
    entrar = () => {
           this.service.autenticar({
                email: this.state.email,
                senha: this.state.senha                
            }).then( response => {
                this.context.iniciarSessao(response.data)
                this.props.history.push('/home')
            }).catch( error => {
                mensagemErro(error.response.data)
            }) 

    }

    prepareCadastrar = () => {
        this.props.history.push('/cadastro-usuarios')
    }

    render(){

        return (
                <div className="row">
                  <div className="col-md-6 offset-md-3">
                        <div className="bs-docs-section">
                            <Card title="Login">                               
                                <div className="row">
                                    <div className="col-lg-12">
                                        <div className="bs-component">
                                            <fieldset>
                                                <FormGroup Label="Email: *" htmlFor="exampleInputEmail1">
                                                    <input type="email"
                                                           value={this.state.email}
                                                           onChange={e => this.setState({email: e.target.value})}
                                                           className="form-control"
                                                           id="exampleInputEmail1"
                                                           aria-describedby="emailHelp"
                                                           placeholder="Digite Email"
                                                    />                                                    
                                                </FormGroup>
                                                <FormGroup Label="Senha: *" htmlFor="exampleInputSenha1">
                                                    <input type="password"
                                                           className="form-control"
                                                           id="exampleInputSenha1"
                                                           aria-describedby="emailHelp"
                                                           placeholder="Digite Senha"
                                                           value={this.state.senha}
                                                           onChange={e => this.setState({senha: e.target.value})}
                                                    />                                                    
                                                </FormGroup>
                                                <button onClick={this.entrar} 
                                                        className="btn btn-success">
                                                        <i className='pi pi-sign-in'></i> Entrar</button>
                                                <button onClick={this.prepareCadastrar} 
                                                        className="btn btn-danger">
                                                        <i className='pi pi-plus'></i> Cadastrar
                                                </button>
                                            </fieldset>
                                        </div>
                                    </div>
                                </div>
                            </Card>                            
                        </div>
                 </div>
            </div>
        )         
    }
}

Login.contextType = AuthContext

export default withRouter (Login)
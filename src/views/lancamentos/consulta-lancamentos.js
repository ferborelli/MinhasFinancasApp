import React from 'react'
import { withRouter } from 'react-router-dom'
import Card from '../../components/card'
import FormGroup from '../../components/form-group'
import SelectMenu from '../../components/selectMenu'
import LancamentosTable from './lancamentosTable'

import LancamentoService from '../../app/service/lancamentoService'

import LocalStorageService from '../../app/service/localstorageService'

import * as messages from '../../components/toastr'

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';


class ConsultaLancamentos extends React.Component {
  
    state = {
        ano: '',
        mes: '',
        tipo: '',
        descricao: '',
        showConfirmaDialog: false,
        lancamentoDeletar: {},
        lancamentos: []
    }

    constructor() {
        super();    
        this.service = new LancamentoService(); 
    }

    buscar = () => {

        if(!this.state.ano) {
            messages.mensagemErro('O campo ano é obrigatorio.')
            return false;
        }
 
        const usuarioLogado = LocalStorageService.obterItem('_usuario_logado');

        //console.log(usuarioLogado);

        const lancamentoFiltro = {
            ano: this.state.ano,
            mes: this.state.mes,
            tipo: this.state.tipo,
            descricao: this.state.descricao,
            usuario: usuarioLogado.id
        }
 
        //console.log(lancamentoFiltro);
        
        this.service
            .consultar(lancamentoFiltro)
            .then( resposta => {
                const lista = resposta.data;
                if(lista.length < 1 ) {
                    messages.mensagemAlert('Nenhum resultado encontrado.');
                }
                this.setState({ lancamentos: lista })
            }).catch( error => {
                console.log(error)
            })

    }

    editar = (id) => {
        this.props.history.push(`/cadastro-lancamentos/${id}`)
    }

    abirConfirmacao = (lancamento) => {
        this.setState({ showConfirmaDialog: true, lancamentoDeletar: lancamento})
    }

    cancelarConfirmarcao = (lancamento) => {
        this.setState({ showConfirmaDialog: false, lancamentoDeletar: {} })
    }

    deletar = () => {
        this.service
            .deletar(this.state.lancamentoDeletar.id)
            .then( response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(this.state.lancamentoDeletar);
                lancamentos.splice(index,1);
                this.setState({lancamentos: lancamentos,showConfirmaDialog: false});
                messages.mensagemSucesso('Lançamento excluido com sucesso.')
            }).catch( error => {
                messages.mensagemErro('Ocorreu algum erro ao deletar o Lançamento.')
            })
    }

    preparaFormularioCadastro = () => {
        this.props.history.push('/cadastro-lancamentos/?') 
    }

    alterarStatus = (lancamento,status) => {
        this.service
            .alterarStatus(lancamento.id,status)
            .then( response => {
                const lancamentos = this.state.lancamentos;
                const index = lancamentos.indexOf(lancamento);
                if (index !== -1){
                    lancamento['status'] = status;   
                    lancamentos[index] = lancamento;
                    this.setState({lancamentos});                 
                }

                messages.mensagemSucesso("Status alterado com sucesso!")
            })

    }

    render() {

        const meses = this.service.obterListaMeses();        
        const tipos = this.service.obterListaTipo();

        const confirmaDialogFooter = (
            <div>
                <Button label="Confirmar" icon="pi pi-check" onClick={this.deletar} />
                <Button label="Cancelar" icon="pi pi-times" onClick={this.cancelarConfirmarcao} />
            </div>
        );
  
        return (
            <Card title="Consulta Lançamentos">
                <div className="row">
                    <div className="col-md-6">
                        <div className="bs-component">

                            <FormGroup htmlFor="inputAno" label="Ano: *">
                                <input  type="text" 
                                        className="form-control" 
                                        id="inputAno"
                                        value={this.state.ano}
                                        onChange={e => this.setState({ano: e.target.value})}
                                        placeholder="Digite Ano"
                                />
                            </FormGroup>
                            
                            <FormGroup htmlFor="inputDescricao" label="Descrição: ">
                                <input  type="text" 
                                        className="form-control" 
                                        id="inputDescricao"
                                        value={this.state.descricao}
                                        onChange={e => this.setState({ descricao: e.target.value })}
                                        placeholder="Digite Descrição"
                                />
                            </FormGroup>

                            <FormGroup htmlFor="inputMes" label="Mês: *">     
                                <SelectMenu id='inputMes' 
                                   value={this.state.mes}
                                   onChange={e => this.setState({mes: e.target.value})} 
                                   className="form-control"  lista={meses} />                              
                            </FormGroup>

                            <FormGroup htmlFor="inputTipo" label="Tipo Lançamento: ">     
                                <SelectMenu id ='inputTipo' className="form-control"  
                                 value={this.state.tipo}
                                 onChange={e => this.setState({ tipo: e.target.value })}
                                lista={tipos} />                              
                            </FormGroup>

                            <button onClick={this.buscar} 
                                    type="button" 
                                    className="btn btn-success">
                                        <i className='pi pi-search'></i> Buscar
                            </button>
                            
                            <button onClick={this.preparaFormularioCadastro} 
                                    type="button" 
                                    className="btn btn-danger">
                                       <i className='pi pi-plus'></i>  Cadastrar
                            </button>

                        </div>
                    </div>
                </div>
                <br/>
                <div className='row'>
                    <div className='col-md-12'> 
                        <div className='bs-component'>
                            <LancamentosTable lancamentos={this.state.lancamentos} 
                                              deleteAction={this.abirConfirmacao}
                                              editAction={this.editar}
                                              alterarStatus={this.alterarStatus}
                            />
                        </div>                        
                    </div>
                </div>
                <div>
                    <Dialog header="Confirmação"
                            visible={this.state.showConfirmaDialog}
                            style={{width: '30vw'}}
                            footer={confirmaDialogFooter}
                            modal={true} 
                            onHide={() => this.setState({showConfirmaDialog: false})}>
                            Confirma a exclusão deste Lançamento?
                    </Dialog>
                </div>

            </Card>
        )
    }

}

export default withRouter(ConsultaLancamentos);

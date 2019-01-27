import { Negociacao, NegociacaoParcial, Negociacoes } from '../models/index';
import { MensagemView, NegociacoesView } from '../views/index';
import { domInject, logarTempoDeExecucao, previnirMultiplosCliques } from '../helpers/decorators/index';
import { NegociacaoService, HandlerFunction } from '../services/NegociacaoService';

import { imprime } from '../helpers/index';

export class NegociacaoController {

    @domInject('#data')
    private _inputData: JQuery;

    @domInject('#quantidade')
    private _inputQuantidade: JQuery;

    @domInject('#valor')
    private _inputValor: JQuery;

    private _negociacoes:Negociacoes = new Negociacoes();
    private _negociacoesView = new NegociacoesView("#negociacoesView");
    private _mensagemView = new MensagemView("#mensagemView");
    private _service = new NegociacaoService;

    constructor() {
        this._negociacoesView.update(this._negociacoes);
    }

    @logarTempoDeExecucao(false)
    @previnirMultiplosCliques(2000)
    adiciona() {
        let data = new Date(this._inputData.val().replace(/-/g, ','));

        if (!this._ehDiaUtil(data)) {
            this._mensagemView.update('Somente negociações em dias úteis!')
            return;
        }

        const negociacao = new Negociacao(
            data,
            parseInt(this._inputQuantidade.val()),
            parseFloat(this._inputValor.val())
        );

        this._negociacoes.adiciona(negociacao);

        imprime(negociacao, this._negociacoes);

        this._negociacoesView.update(this._negociacoes);
        this._mensagemView.update('Negociação adicionada com sucesso!');
    }

    @previnirMultiplosCliques()
    importaDados() {

        const isOk: HandlerFunction = (res: Response) => {
            if (res.ok) {
                return res;
            } else {
                throw new Error(res.statusText);
            }
        }

        this._service
            .obterNegociacoes(isOk)
            .then((negociacoes: Negociacao[]) => {
                const negociacoesJaImportadas = this._negociacoes.paraArray();

                negociacoes
                    .filter(negociacao => !negociacoesJaImportadas.some(jaImportada =>
                         negociacao.ehIgual(jaImportada)))
                    .forEach(negociacao => this._negociacoes.adiciona(negociacao));

                this._negociacoesView.update(this._negociacoes);
            })
            .catch(err => this._mensagemView.update(err.message));
    } 

    /* mesmo que o método acima, porém usando o recurso async, codificamos como sincrono
    porém o transpilador o converte em assíncrono
    @previnirMultiplosCliques()
    async importaDados() {
        
        try {
            
            // usou await antes da chamada de this.service.obterNegociacoes()
            
            const negociacoesParaImportar = await this._service
                .obterNegociacoes(res => {
                    
                    if(res.ok) {
                        return res;
                    } else {
                        throw new Error(res.statusText);
                    }
                });

            const negociacoesJaImportadas = this._negociacoes.paraArray();

            negociacoesParaImportar
                .filter((negociacao : Negociacao) => 
                    !negociacoesJaImportadas.some(jaImportada => 
                        negociacao.ehIgual(jaImportada)))
                .forEach((negociacao: Negociacao) => 
                this._negociacoes.adiciona(negociacao))
                .;
                
            this._negociacoesView.update(this._negociacoes);

        } catch(err) {
            this._mensagemView.update(err.message);
        }
    }*/

    private _ehDiaUtil(data: Date) : boolean {
        return data.getDay() != DiaDaSemana.Domingo && data.getDay() != DiaDaSemana.Sabado;
    }
}

enum DiaDaSemana {
    Domingo,
    Segunda,
    Terca,
    Quarta,
    Quinta,
    Sexta,
    Sabado
}
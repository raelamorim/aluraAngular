import { Negociacao } from './Negociacao';
import { logarTempoDeExecucao } from '../helpers/decorators/index';
import { MeuObjeto } from './MeuObjeto';

export class Negociacoes implements MeuObjeto<Negociacoes> {

    private _negociacoes: Array<Negociacao> =  [];

    @logarTempoDeExecucao(true)
    adiciona(negociacao: Negociacao): void {
        this._negociacoes.push(negociacao);
    }

    @logarTempoDeExecucao(true)
    paraArray(): Negociacao[] {
        return ([] as Negociacao[]).concat(this._negociacoes);
    }

    paraTexto(): void {
        console.log('-- paraTexto --');
        console.log(JSON.stringify(this._negociacoes));
    }

    ehIgual(negociacoes: Negociacoes): boolean {
        return JSON.stringify(this._negociacoes) == JSON.stringify(negociacoes.paraArray());
    }
}
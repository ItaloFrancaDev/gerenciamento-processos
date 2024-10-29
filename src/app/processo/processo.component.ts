import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Processo, Parte, Acao } from '../backend.mock';
import { BackendMock } from '../backend.mock';

@Component({
  selector: 'app-processo',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './processo.component.html',
  styleUrls: ['./processo.component.scss']
})
export class ProcessoComponent implements OnInit {
  processos: Processo[] = [];
  novoProcesso: Processo = this.initNovoProcesso();
  novaParte: Parte = this.initNovaParte();
  novaAcao: Acao = this.initNovaAcao();

  erroProcesso: string = '';
  erroParte: string = '';
  erroAcao: string = '';

  constructor(private backend: BackendMock) { }

  ngOnInit() {
    this.processos = this.backend.getProcessos();
  }

  initNovoProcesso(): Processo {
    return {
      numeroProcesso: '',
      dataAbertura: new Date(),
      descricao: '',
      partes: [],
      acoes: [],
      status: 'ativo'
    };
  }

  initNovaParte(): Parte {
    return { nomeCompleto: '', cpfCnpj: '', tipo: 'autor', contato: { email: '', telefone: '' } };
  }

  initNovaAcao(): Acao {
    return { tipo: 'petição', dataRegistro: new Date(), descricao: '' };
  }

  adicionarProcesso() {
    this.erroProcesso = '';

    if (!this.validateNovoProcesso()) return;

    this.backend.createProcesso({ ...this.novoProcesso });
    this.processos.push({ ...this.novoProcesso });
    this.resetarNovoProcesso();
  }

  validateNovoProcesso(): boolean {
    if (!this.novoProcesso.numeroProcesso || !this.novoProcesso.descricao) {
      this.erroProcesso = 'Número do processo e descrição são obrigatórios.';
      return false;
    }

    if (this.processos.some(processo => processo.numeroProcesso === this.novoProcesso.numeroProcesso)) {
      this.erroProcesso = 'Número do processo deve ser único.';
      return false;
    }
    return true;
  }

  isValidCpfCnpj(cpfCnpj: string): boolean {
    const onlyNumbers = cpfCnpj.replace(/\D/g, '');
    return onlyNumbers.length === 11 || onlyNumbers.length === 14;
  }

  adicionarParte() {
    this.erroParte = '';

    if (!this.validateNovaParte()) return;

    this.novoProcesso.partes.push({ ...this.novaParte });
    this.resetarNovaParte();
  }

  validateNovaParte(): boolean {
    if (!this.novaParte.nomeCompleto || !this.novaParte.cpfCnpj) {
      this.erroParte = 'Nome completo e CPF/CNPJ são obrigatórios.';
      return false;
    }

    if (!this.isValidCpfCnpj(this.novaParte.cpfCnpj)) {
      this.erroParte = 'CPF ou CNPJ inválido.';
      return false;
    }
    return true;
  }

  adicionarAcao() {

    if (!this.validateNovaAcao()) return;

    this.novoProcesso.acoes.push({ ...this.novaAcao });
    this.resetarNovaAcao();
  }

  validateNovaAcao(): boolean {
    if (!this.novaAcao.descricao) {
      this.erroAcao = 'Descrição da ação é obrigatória.';
      return false;
    }
    return true;
  }

  arquivarProcesso(numeroProcesso: string) {
    this.backend.archiveProcesso(numeroProcesso);
    this.processos = this.processos.filter(processo => processo.numeroProcesso !== numeroProcesso);
  }

  resetarNovoProcesso() {
    this.novoProcesso = this.initNovoProcesso();
  }

  resetarNovaParte() {
    this.novaParte = this.initNovaParte();
  }

  resetarNovaAcao() {
    this.novaAcao = this.initNovaAcao();
  }

  removerProcesso(numeroProcesso: string): void {
    this.processos = this.processos.filter(processo => processo.numeroProcesso !== numeroProcesso);
  }

  editarProcesso(processo: Processo): void {
    this.novoProcesso = { ...processo };
  }


}

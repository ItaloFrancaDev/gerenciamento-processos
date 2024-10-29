// src/app/backend.mock.ts
import { Injectable } from '@angular/core';


export interface Contato {
  email: string;
  telefone: string;
}

export interface Parte {
  nomeCompleto: string;
  cpfCnpj: string;
  tipo: 'autor' | 'réu' | 'advogado';
  contato: Contato;
}

export interface Acao {
  tipo: 'petição' | 'audiência' | 'sentença';
  dataRegistro: Date;
  descricao: string;
}

export interface Processo {
  numeroProcesso: string;
  dataAbertura: Date;
  descricao: string;
  partes: Parte[];
  acoes: Acao[];
  status: 'ativo' | 'suspenso' | 'arquivado';
}

@Injectable({
  providedIn: 'root',
})
export class BackendMock {
  private processos: Processo[] = [];

  constructor() {

    this.processos = [
      {
        numeroProcesso: '0001',
        dataAbertura: new Date(),
        descricao: 'Processo de exemplo',
        partes: [],
        acoes: [],
        status: 'ativo',
      },
    ];
  }

  getProcessos() {
    return this.processos;
  }

  createProcesso(processo: Processo) {
    if (!this.processos.some(p => p.numeroProcesso === processo.numeroProcesso)) {
      this.processos.push(processo);
    } else {
      throw new Error('Número do processo já existe.');
    }
  }


  addParte(numeroProcesso: string, parte: Parte) {
    const processo = this.processos.find(p => p.numeroProcesso === numeroProcesso);
    if (processo) {
      processo.partes.push(parte);
    }
  }

  
  addAcao(numeroProcesso: string, acao: Acao) {
    const processo = this.processos.find(p => p.numeroProcesso === numeroProcesso);
    if (processo) {
      processo.acoes.push(acao);
    }
  }

  editProcesso(updatedProcesso: Partial<Processo> & { numeroProcesso: string }) {
    const index = this.processos.findIndex(p => p.numeroProcesso === updatedProcesso.numeroProcesso);
    if (index !== -1) {
      this.processos[index] = { ...this.processos[index], ...updatedProcesso };
    }
  }

  archiveProcesso(numeroProcesso: string) {
    const processo = this.processos.find(p => p.numeroProcesso === numeroProcesso);
    if (processo) {
      processo.status = 'arquivado';
    }
  }
}

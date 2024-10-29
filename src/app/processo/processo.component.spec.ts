import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProcessoComponent } from './processo.component';
import { BackendMock, Processo, Parte, Acao } from '../backend.mock';
import { CommonModule } from '@angular/common';

describe('ProcessoComponent', () => {
  let component: ProcessoComponent;
  let fixture: ComponentFixture<ProcessoComponent>;
  let backendMock: BackendMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, ProcessoComponent], // Mover ProcessoComponent para imports
      providers: [BackendMock],
    }).compileComponents();

    fixture = TestBed.createComponent(ProcessoComponent);
    component = fixture.componentInstance;
    backendMock = TestBed.inject(BackendMock);
    fixture.detectChanges();
  });

  it('deve criar o componente', () => {
    expect(component).toBeTruthy();
  });

  it('deve recuperar processos do BackendMock', () => {
    const processos: Processo[] = backendMock.getProcessos();
    expect(processos.length).toBeGreaterThan(0);
  });

  it('deve criar um novo processo com número único', () => {
    const novoProcesso: Processo = {
      numeroProcesso: '0002',
      dataAbertura: new Date(),
      descricao: 'Novo processo de exemplo',
      partes: [],
      acoes: [],
      status: 'ativo',
    };

    backendMock.createProcesso(novoProcesso);
    const processos: Processo[] = backendMock.getProcessos();
    expect(processos.length).toBe(2); // Certifique-se de que 2 é o número correto esperado
  });

  it('deve adicionar uma parte a um processo existente', () => {
    const parte: Parte = {
      nomeCompleto: 'João Silva',
      cpfCnpj: '12345678901',
      tipo: 'autor',
      contato: {
        email: 'joao.silva@example.com',
        telefone: '123456789',
      },
    };

    backendMock.addParte('0001', parte);
    const processos = backendMock.getProcessos();
    expect(processos[0].partes.length).toBe(1);
    expect(processos[0].partes[0].nomeCompleto).toBe('João Silva');
  });

  it('não deve adicionar uma parte a um processo inexistente', () => {
    const parte: Parte = {
      nomeCompleto: 'Maria Souza',
      cpfCnpj: '09876543210',
      tipo: 'réu',
      contato: {
        email: 'maria.souza@example.com',
        telefone: '987654321',
      },
    };

    backendMock.addParte('0003', parte);
    const processos = backendMock.getProcessos();
    expect(processos[0].partes.length).toBe(0);
  });

  it('deve adicionar uma ação a um processo existente', () => {
    const acao: Acao = {
      tipo: 'petição',
      dataRegistro: new Date(),
      descricao: 'Petição inicial',
    };

    backendMock.addAcao('0001', acao);
    const processos = backendMock.getProcessos();
    expect(processos[0].acoes.length).toBe(1);
    expect(processos[0].acoes[0].descricao).toBe('Petição inicial');
  });

  it('não deve adicionar uma ação a um processo inexistente', () => {
    const acao: Acao = {
      tipo: 'audiência',
      dataRegistro: new Date(),
      descricao: 'Audiência de conciliação',
    };

    backendMock.addAcao('0003', acao);
    const processos = backendMock.getProcessos();
    expect(processos[0].acoes.length).toBe(0);
  });

  it('deve atualizar um processo existente', () => {
    const updatedProcesso: Partial<Processo> & { numeroProcesso: string } = {
      numeroProcesso: '0001',
      descricao: 'Processo de exemplo atualizado',
    };

    backendMock.editProcesso(updatedProcesso);
    const processos = backendMock.getProcessos();
    expect(processos[0].descricao).toBe('Processo de exemplo atualizado');
  });

  it('não deve editar um processo inexistente', () => {
    const updatedProcesso: Partial<Processo> & { numeroProcesso: string } = {
      numeroProcesso: '0003',
      descricao: 'Descrição de processo não existente',
    };

    backendMock.editProcesso(updatedProcesso);
    const processos = backendMock.getProcessos();
    expect(processos.length).toBe(1);
  });

  it('deve arquivar um processo existente', () => {
    backendMock.archiveProcesso('0001');
    const processos = backendMock.getProcessos();
    expect(processos[0].status).toBe('arquivado');
  });

  it('não deve arquivar um processo inexistente', () => {
    backendMock.archiveProcesso('0003');
    const processos = backendMock.getProcessos();
    expect(processos[0].status).toBe('ativo');
  });

  it('não deve criar um processo com um número existente', () => {
    const processoDuplicado: Processo = {
      numeroProcesso: '0001',
      dataAbertura: new Date(),
      descricao: 'Novo processo com número existente',
      partes: [],
      acoes: [],
      status: 'ativo',
    };

    expect(() => backendMock.createProcesso(processoDuplicado)).toThrowError('Número do processo já existe.');
  });
});

import { IMediator } from '../../../../shared/application/Pipeline';
import * as Commands from '../commands';
import * as Queries from '../queries';

export class JournalApplicationService {
  constructor(private readonly mediator: IMediator) {}
  
  async create(payload: any) { return this.mediator.send(new Commands.CreateJournalCommand(payload)); }
  async post(id: string) { return this.mediator.send(new Commands.PostJournalCommand(id)); }
  async reverse(id: string, date: Date) { return this.mediator.send(new Commands.ReverseJournalCommand(id, date)); }
  async getById(id: string) { return this.mediator.query(new Queries.GetJournalById(id)); }
}

export class BudgetApplicationService {
  constructor(private readonly mediator: IMediator) {}
}

export class LedgerApplicationService {
  constructor(private readonly mediator: IMediator) {}
}

export class ReconciliationApplicationService {
  constructor(private readonly mediator: IMediator) {}
}

export class CurrencyApplicationService {
  constructor(private readonly mediator: IMediator) {}
}

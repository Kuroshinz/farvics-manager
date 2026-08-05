import { UserId, Email, DisplayName } from './ValueObjects';
import { DomainEvent, UserCreated, UserUpdated, ProfileCompleted } from './Events';

export interface UserProps {
  id: UserId;
  email: Email;
  firstName: DisplayName | null;
  lastName: DisplayName | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  version: number;
}

export class User {
  private _domainEvents: DomainEvent[] = [];

  private constructor(private readonly props: UserProps) {}

  public static create(props: UserProps, isNew: boolean = false): User {
    const user = new User(props);
    if (isNew) {
      user.addDomainEvent(new UserCreated(props.id, props.email.value));
    }
    return user;
  }

  public get id(): UserId { return this.props.id; }
  public get email(): Email { return this.props.email; }
  public get firstName(): DisplayName | null { return this.props.firstName; }
  public get lastName(): DisplayName | null { return this.props.lastName; }
  public get version(): number { return this.props.version; }
  public get domainEvents(): DomainEvent[] { return [...this._domainEvents]; }

  private addDomainEvent(event: DomainEvent) {
    this._domainEvents.push(event);
  }

  public clearEvents() {
    this._domainEvents = [];
  }

  public updateProfile(firstName: string, lastName: string): void {
    this.props.firstName = new DisplayName(firstName);
    this.props.lastName = new DisplayName(lastName);
    this.props.updatedAt = new Date();
    this.props.version++;
    
    this.addDomainEvent(new UserUpdated(this.props.id));
    this.addDomainEvent(new ProfileCompleted(this.props.id));
  }
}

export interface IUserRepository {
  findById(id: UserId): Promise<User | null>;
  save(user: User): Promise<void>;
}

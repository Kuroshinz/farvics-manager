import { IPipelineBehavior } from './Pipeline';

export interface IValidationBehavior<TRequest, TResponse> extends IPipelineBehavior<TRequest, TResponse> {}
export interface IAuthorizationBehavior<TRequest, TResponse> extends IPipelineBehavior<TRequest, TResponse> {}
export interface ILoggingBehavior<TRequest, TResponse> extends IPipelineBehavior<TRequest, TResponse> {}
export interface IMetricsBehavior<TRequest, TResponse> extends IPipelineBehavior<TRequest, TResponse> {}
export interface IRetryBehavior<TRequest, TResponse> extends IPipelineBehavior<TRequest, TResponse> {}
export interface IAuditBehavior<TRequest, TResponse> extends IPipelineBehavior<TRequest, TResponse> {}
export interface ITransactionBehavior<TRequest, TResponse> extends IPipelineBehavior<TRequest, TResponse> {}
export interface IEventPublishingBehavior<TRequest, TResponse> extends IPipelineBehavior<TRequest, TResponse> {}

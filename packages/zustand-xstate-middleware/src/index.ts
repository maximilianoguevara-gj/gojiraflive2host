import { interpret } from 'xstate';
import type { StateMachine, Interpreter } from 'xstate';
import type { SetState } from 'zustand';

export type Store<M> = M extends StateMachine<
infer Context,
infer Schema,
infer Event,
infer State,
infer _A,
infer _B,
infer _C
>
  ? {
    state: Interpreter<Context, Schema, Event, State>['state'];
    send: Interpreter<Context, Schema, Event, State>['send'];
    service: Interpreter<Context, Schema, Event, State>;
  }
  : never;

// eslint-disable-next-line max-len
const xstate = <M extends StateMachine<any, any, any, any, any, any, any>>(machine: M) => (set: SetState<Store<M>>): Store<M> => {
  const service = interpret(machine)
    .onTransition((state) => {
      const initialStateChanged = state.changed === undefined && Object.keys(state.children).length;

      if (state.changed || initialStateChanged) {
        set({ state } as any);
      }
    })
    .start();

  return {
    state: service.state,
    send: service.send,
    service,
  } as Store<M>;
};

export default xstate;

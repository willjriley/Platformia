/**
 * Finite State Machine (FSM) class
 *
 * This class implements a simple finite state machine (FSM) for managing states and transitions.
 *
 * Usage:
 * const fsm = new FSM('initialState');
 * fsm.addTransition('state1', 'event1', 'state2', () => { console.log('Transitioned from state1 to state2'); });
 * fsm.handleEvent('event1');
 *
 * Methods:
 * - constructor(initialState): Initializes the FSM with an initial state.
 * - addTransition(state, event, nextState, action): Defines a transition from one state to another based on an event.
 * - handleEvent(event): Handles an event by checking if there is a defined transition for the current state and event.
 * - getState(): Returns the current state of the FSM.
 *
 *
 *   this.fsm.addTransition('idle', 'walk', 'walk', () => this.setState('walk_right'));
 *
 *   1 state: 'idle'
 *      This is the current state of the FSM. The transition will only be considered if the FSM is currently in the 'idle' state.
 *
 *   2 event: 'walk'
 *      This is the event that triggers the transition. When the FSM receives the 'walk' event while in the 'idle' state, it will consider this transition.
 *
 *   3 nextState: 'walk'
 *      This is the state to transition to. In this case, the FSM will transition to the 'walk' state.
 *      action: () => this.setState('walk_right')
 *
 *    This is the function to execute when the transition occurs. In this case, it calls the setState method to set the state to 'walk_right'. This function can be used to perform any actions needed during the transition, such as updating animations or playing sounds.
 *    Purpose of the Transition
 *    The purpose of this specific transition is to handle the case where the FSM is in the 'idle' state and receives a 'walk' event. By defining this transition, you ensure that the FSM can move from the 'idle' state to the 'walk' state and perform the necessary actions to update the state and animation.
 *
 */
export default class FSM {
    constructor(initialState) {
        this.state = initialState;
        this.transitions = {};
    }

    addTransition(state, event, nextState, action = () => { }) {
        if (!this.transitions[state]) {
            this.transitions[state] = {};
        }
        this.transitions[state][event] = { nextState, action };
    }

    handleEvent(event) {
        const stateTransitions = this.transitions[this.state];
        if (stateTransitions && stateTransitions[event]) {
            const { nextState, action } = stateTransitions[event];
            //console.log(`FSM Transition: ${this.state} -> ${nextState} on event ${event}`);
            this.state = nextState;
            action();
        } else {
            console.warn(`No transition for event ${event} in state ${this.state}`);
        }
    }

    getState() {
        return this.state;
    }
}
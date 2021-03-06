/* @flow */

import _ from 'lodash';

/**
 * Sets specific properties of a specific state to specific values and prevents
 * unnecessary state changes.
 *
 * @param {Object} target - The state on which the specified properties are to
 * be set.
 * @param {Object} source - The map of properties to values which are to be set
 * on the specified target.
 * @returns {Object} The specified target if the values of the specified
 * properties equal the specified values; otherwise, a new state constructed
 * from the specified target by setting the specified properties to the
 * specified values.
 */
export function assign(target: Object, source: Object) {
    let t = target;

    for (const property in source) { // eslint-disable-line guard-for-in
        t = set(t, property, source[property], t === target);
    }

    return t;
}

/**
 * Determines whether {@code a} equals {@code b} according to deep comparison
 * (which makes sense for Redux and its state definition).
 *
 * @param {*} a - The value to compare to {@code b}.
 * @param {*} b - The value to compare to {@code a}.
 * @returns {boolean} True if {@code a} equals {@code b} (according to deep
 * comparison); false, otherwise.
 */
export function equals(a: any, b: any) {
    return _.isEqual(a, b);
}

/**
 * Sets a specific property of a specific state to a specific value. Prevents
 * unnecessary state changes (when the specified <tt>value</tt> is equal to the
 * value of the specified <tt>property</tt> of the specified <tt>state</tt>).
 *
 * @param {Object} state - The (Redux) state from which a new state is to be
 * constructed by setting the specified <tt>property</tt> to the specified
 * <tt>value</tt>.
 * @param {string} property - The property of <tt>state</tt> which is to be
 * assigned the specified <tt>value</tt> (in the new state).
 * @param {*} value - The value to assign to the specified <tt>property</tt>.
 * @returns {Object} The specified <tt>state</tt> if the value of the specified
 * <tt>property</tt> equals the specified <tt>value/tt>; otherwise, a new state
 * constructed from the specified <tt>state</tt> by setting the specified
 * <tt>property</tt> to the specified <tt>value</tt>.
 */
export function set(state: Object, property: string, value: any) {
    return _set(state, property, value, /* copyOnWrite */ true);
}

/* eslint-disable max-params */

/**
 * Sets a specific property of a specific state to a specific value. Prevents
 * unnecessary state changes (when the specified <tt>value</tt> is equal to the
 * value of the specified <tt>property</tt> of the specified <tt>state</tt>).
 *
 * @param {Object} state - The (Redux) state from which a state is to be
 * constructed by setting the specified <tt>property</tt> to the specified
 * <tt>value</tt>.
 * @param {string} property - The property of <tt>state</tt> which is to be
 * assigned the specified <tt>value</tt>.
 * @param {*} value - The value to assign to the specified <tt>property</tt>.
 * @param {boolean} copyOnWrite - If the specified <tt>state</tt> is to not be
 * modified, <tt>true</tt>; otherwise, <tt>false</tt>.
 * @returns {Object} The specified <tt>state</tt> if the value of the specified
 * <tt>property</tt> equals the specified <tt>value/tt> or <tt>copyOnWrite</tt>
 * is truthy; otherwise, a new state constructed from the specified
 * <tt>state</tt> by setting the specified <tt>property</tt> to the specified
 * <tt>value</tt>.
 */
function _set(
        state: Object,
        property: string,
        value: any,
        copyOnWrite: boolean) {
    // Delete state properties that are to be set to undefined. (It is a matter
    // of personal preference, mostly.)
    if (typeof value === 'undefined'
            && Object.prototype.hasOwnProperty.call(state, property)) {
        const newState = copyOnWrite ? { ...state } : state;

        if (delete newState[property]) {
            return newState;
        }
    }

    if (state[property] !== value) {
        if (copyOnWrite) {
            return {
                ...state,
                [property]: value
            };
        }

        state[property] = value;
    }

    return state;
}

/* eslint-enable max-params */

/**
 * Returns redux state from the specified <tt>stateful</tt> which is presumed to
 * be related to the redux state (e.g. the redux store, the redux
 * <tt>getState</tt> function).
 *
 * @param {Function|Object} stateful - The entity such as the redux store or the
 * redux <tt>getState</tt> function from which the redux state is to be
 * returned.
 * @returns {Object} The redux state.
 */
export function toState(stateful: Function | Object) {
    if (stateful) {
        if (typeof stateful === 'function') {
            return stateful();
        }

        const { getState } = stateful;

        if (typeof getState === 'function'
                && typeof stateful.dispatch === 'function') {
            return getState();
        }
    }

    return stateful;
}

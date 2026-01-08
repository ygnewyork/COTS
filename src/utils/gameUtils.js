/**
 * Safely access nested object properties using a dot-notation string.
 * e.g. getNested(state, 'stats.score')
 */
export const getNested = (obj, path) => {
    return path.split(".").reduce((acc, part) => acc && acc[part], obj);
};

/**
 * Safely set nested object properties using a dot-notation string.
 * Returns a NEW object (immutable update).
 */
export const setNested = (obj, path, value) => {
    const parts = path.split(".");
    const last = parts.pop();
    const newObj = { ...obj };
    let current = newObj;

    for (const part of parts) {
        current[part] = { ...current[part] };
        current = current[part];
    }

    current[last] = value;
    return newObj;
};

/**
 * Evaluate a simple mathematical formula string against the state.
 * Supports basic arithmetic and Math functions.
 * WARNING: Uses Function constructor (like eval) - ensure formulas are trusted.
 */
export const evaluateFormula = (formula, state) => {
    try {
        // Create a function that destructures specific usable variables from state
        // For simplicity in this demo, we'll flattening the state or just access properties directly if we parse them.
        // robust way: replace "cc.balance" with "state.cc.balance" in the string logic
        // OR: use a Function with 'state' as arg.

        // We need to parse variables like 'cc.limit' -> 'state.cc.limit'
        // This regex looks for words that might be properties, avoiding JS keywords/Math keys
        // For this specific JSON structure, simple replacement is safer/easier if keys are known,
        // but dynamic is better.

        // Let's use a function where we pass the flatten state or access it via `this` or argument.
        // The formulas in JSON look like: "cc.limit > 0 ? (cc.balance / cc.limit) * 100 : 0"
        // We can wrap execution in a closer with 'score', 'cash', 'cc', etc.

        const keys = Object.keys(state);
        const values = Object.values(state);

        // safe-ish eval for the hackathon context
        const func = new Function(...keys, `return ${formula}`);
        return func(...values);
    } catch (e) {
        console.warn("Formula eval error:", e, formula);
        return 0;
    }
};

/**
 * Check if all conditions in the list are met.
 * condition: { op: 'gte', path: 'stats.onTimeStreak', value: 2 }
 */
export const checkConditions = (state, conditions = []) => {
    if (!conditions || conditions.length === 0) return true;

    return conditions.every((cond) => {
        const currentVal = getNested(state, cond.path);
        const targetVal = cond.value;

        switch (cond.op) {
            case "eq":
                return currentVal == targetVal;
            case "neq":
                return currentVal != targetVal;
            case "gt":
                return currentVal > targetVal;
            case "gte":
                return currentVal >= targetVal;
            case "lt":
                return currentVal < targetVal;
            case "lte":
                return currentVal <= targetVal;
            default:
                return false;
        }
    });
};

/**
 * Apply a list of effects to the state and return the new state.
 * effect: { op: 'add', path: 'score', value: 10 }
 */
export const applyEffects = (state, effects = []) => {
    let newState = { ...state };

    effects.forEach((effect) => {
        const currentVal = getNested(newState, effect.path);

        let newVal;
        switch (effect.op) {
            case "add":
                // Handle numeric addition or array pushing if strictly needed,
                // but JSON mostly shows numeric adds or simple string sets.
                // For riskFlags (array vs string in JSON? JSON shows string "HIGH_RISK..." but initial is [])
                // Let's handle generic add.
                if (Array.isArray(currentVal)) {
                    newVal = [...currentVal, effect.value];
                } else {
                    newVal = (currentVal || 0) + effect.value;
                }
                break;
            case "set":
                newVal = effect.value;
                break;
            case "mul":
                newVal = (currentVal || 0) * effect.value;
                break;
            case "setByFormula":
                newVal = evaluateFormula(effect.formula, newState);
                break;
            default:
                return;
        }

        newState = setNested(newState, effect.path, newVal);
    });

    return newState;
};

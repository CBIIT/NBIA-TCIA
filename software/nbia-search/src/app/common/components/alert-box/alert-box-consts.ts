export const AlertBoxType = {
    INFO: 0,
    CONFIRM: 1,
    WARN: 2,
    ERROR: 3
};

/**
 * These get ORed together.
 *
 * @type {{OKAY: number; CONTINUE: number; DELETE: number; SAVE: number; CANCEL: number}}
 */
export const AlertBoxButtonType = {
    OKAY: 1,
    CONTINUE: 2,
    DELETE: 4,
    SAVE: 8,
    CANCEL: 16
};

export const AlertBoxButtonText = [, 'Okay', 'Continue', , 'Delete', , , , 'Save', , , , , , , , 'Cancel'];


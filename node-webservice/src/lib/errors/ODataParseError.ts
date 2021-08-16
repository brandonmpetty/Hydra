/**
 * OData related parsing error
 * 
 * @remarks
 * If caught by the global error handler, this should return an HTTP 400.
 */
 export default class ODataParseError extends Error {
    message: string;
    badValue: string;

    /**
     * @param message   - A message string detailing the issue
     * @param badValue  - Optional - A potentially unsafe value parsed from the OData
     */
    constructor(message: string, badValue?: string) {
        super(message);
        this.message = message;
        this.badValue = badValue;
    }
}
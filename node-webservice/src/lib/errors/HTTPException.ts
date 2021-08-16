/**
 * HttpException is used for feeding all HTTP related errors back through
 * the promise chain.
 * 
 * @see https://en.wikipedia.org/wiki/List_of_HTTP_status_codes
 * 
 * @remarks
 * All other errors *may* be processed with an Uncaught Exception handler 
 * with a status code of 500.
 */
export default class HttpException extends Error {
    status: number;
    message: string;

    /**
     * @param status    - HTTP status code
     * @param message   - A message string detailing the issue
     */
    constructor(status: number, message: string) {
        super(message);
        this.status = status;
        this.message = message;
    }
}

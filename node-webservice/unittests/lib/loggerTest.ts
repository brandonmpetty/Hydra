import logger from '../../src/lib/logger';

/**
 * This hooks stdout and captures all logs from your Winston logger.
 * 
 * @param callback The log function you want to test
 * @returns The string captured from the logger
 */
function logCapture(callback: Function): string {

    // Store off old write function
    const orig = process.stdout.write;
    let bufferHooked: string;

    // Replace it with our hook
    process.stdout.write = (buffer: string, cb?: any): boolean => {
        bufferHooked = buffer;
        return true;
    };

    // Safely call our logger routine
    try {
        callback();
    }
    finally {
        // Unhook
        process.stdout.write = orig;
    }

    return bufferHooked;
}


describe("With a valid logger instance", () => {

    // Note: We are using the live logger!
    // Do not log 'error' because it will write to file.

    it("will log 'debug' to console", () => {

        const message: string = 'This is a test';
        const result = logCapture(()=>{
            logger.debug(message);
        });
        
        expect(result).toContain(message)
    });

    it("will log 'warn' to console", () => {

        const message: string = 'This is a test';
        const result = logCapture(()=>{
            logger.warn(message);
        });
        
        expect(result).toContain(message)
    });
});